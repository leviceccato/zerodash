import { useRef } from 'react'
import { z } from 'zod'
import createClient, { type Client } from 'openapi-fetch'
import type { paths } from '@/spotify.d.ts'
import { env } from '@/env.ts'
import type { ApiResponse } from '@/openapi.ts'

export type PlaybackState = ApiResponse<paths, '/me/player', 'get'>

export function useSpotify() {
	const spotify = useRef(createSpotifyClient<paths>(null))
	const tokenData = useRef<z.output<typeof tokenDataSchema>>(undefined)

	async function clientReady(): Promise<void> {
		if (tokenData.current) {
			return
		}

		const tokenDataRaw = await Deno.readTextFile('spotify-token-data.json')

		const newTokenData = parseTokenData(tokenDataRaw)

		spotify.current = createSpotifyClient<paths>(newTokenData.access_token)

		tokenData.current = newTokenData
	}

	async function refreshToken(): Promise<void> {
		if (!tokenData.current) {
			throw new Error("Can't refresh Spotify token without existing token.")
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

			spotify.current = createSpotifyClient<paths>(newTokenData.access_token)

			tokenData.current = newTokenData
		} catch (exception) {
			throw exception
		}
	}

	async function getPlaybackState(): Promise<PlaybackState | undefined> {
		await clientReady()

		const response = await spotify.current.GET('/me/player')

		if (response.error) {
			if (response.error.error.status === 401) {
				await refreshToken()
				return await getPlaybackState()
			}
			throw new Error(response.error.error.message)
		}

		return response.data
	}

	return {
		getPlaybackState,
	}
}

// deno-lint-ignore ban-types -- This is what the library uses
function createSpotifyClient<TPaths extends {}>(
	token: string | null,
): Client<TPaths> {
	return createClient<TPaths>({
		baseUrl: 'https://api.spotify.com/v1',
		headers: !token ? {} : {
			Authorization: `Bearer ${token}`,
		},
	})
}

function parseTokenData(rawToken: string): z.output<typeof tokenDataSchema> {
	return tokenDataSchema.parse(JSON.parse(rawToken))
}

const tokenDataSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	refresh_token: z.string(),
	expires: z.number().optional(),
})
