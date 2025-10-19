import { useRef } from 'react'
import { z } from 'zod'
import createClient from 'openapi-fetch'
import type { paths } from '@/spotify.d.ts'
import { env } from '@/env.ts'
import type { ApiResponse } from '@/openapi.ts'

export type PlaybackState = ApiResponse<paths, '/me/player', 'get'>

export function useSpotify() {
	const spotify = useRef(createClient<paths>({
		baseUrl: 'https://api.spotify.com/v1',
	}))
	const tokenData = useRef<z.output<typeof tokenDataSchema> | null>(null)

	async function clientReady(): Promise<void> {
		if (tokenData.current) {
			return
		}

		const tokenDataRaw = await Deno.readTextFile('spotify-token-data.json')

		const newTokenData = parseTokenData(tokenDataRaw)

		updateClientWithToken(newTokenData)

		tokenData.current = newTokenData
	}

	function updateClientWithToken(
		tokenData: z.output<typeof tokenDataSchema>,
	): void {
		spotify.current.use({
			onRequest: (params) => {
				params.request.headers.set(
					'Authorization',
					`Bearer ${tokenData.access_token}`,
				)
			},
		})
	}

	function parseTokenData(rawToken: string): z.output<typeof tokenDataSchema> {
		return tokenDataSchema.parse(JSON.parse(rawToken))
	}

	async function refreshToken(): Promise<void> {
		if (!tokenData.current) {
			throw new Error('Cannot refresh token without existing token')
		}

		try {
			const response = await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					grant_type: 'refresh_token',
					refresh_token: tokenData.current.refresh_token,
					client_id: env.SPOTIFY_CLIENT_ID,
				}),
			})
			if (!response.ok) {
				throw new Error('Failed to fetch token')
			}

			const data = await response.text()

			await Deno.writeTextFile('spotify-token-data.json', data)

			const newTokenData = parseTokenData(data)

			updateClientWithToken(newTokenData)
		} catch (exception) {
			throw exception
		}
	}

	async function getPlaybackState(): Promise<PlaybackState> {
		await clientReady()

		const response = await spotify.current.GET('/me/player')

		if (response.error) {
			if (response.error.error.status === 401) {
				await refreshToken()
				return await getPlaybackState()
			}
			throw new Error(response.error.error.message)
		}

		if (!response.data) {
			throw new Error("Couldn't fetch playback state")
		}

		return response.data
	}

	return {
		getPlaybackState,
	}
}

const tokenDataSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	refresh_token: z.string(),
	expires: z.number().optional(),
})
