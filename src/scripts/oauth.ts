import { env } from '@/env.ts'

const redirectUri = 'https://127.0.0.1:8000'

const codeVerifier = createCodeVerifier()
const codeChallenge = await createCodeChallenge(codeVerifier)

const spotifyAuthParams = new URLSearchParams({
	client_id: env.SPOTIFY_CLIENT_ID,
	response_type: 'code',
	redirect_uri: `${redirectUri}/spotify`,
	code_challenge_method: 'S256',
	code_challenge: codeChallenge,
	scope: 'user-read-currently-playing user-read-playback-state',
})

const spotifyAuthUrl =
	`https://accounts.spotify.com/authorize?${spotifyAuthParams}`

const googleAuthParams = new URLSearchParams({
	client_id: env.GOOGLE_CLIENT_ID,
	response_type: 'code',
	redirect_uri: `${redirectUri}/google`,
	code_challenge_method: 'S256',
	code_challenge: codeChallenge,
	scope: 'https://www.googleapis.com/auth/calendar.readonly',
})

const googleAuthUrl =
	`https://accounts.google.com/o/oauth2/v2/auth?${googleAuthParams}`

console.log(
	`Authenticate Spotify using this URL: ${spotifyAuthUrl}`,
)
console.log(
	`Authenticate Google using this URL: ${googleAuthUrl}`,
)

Deno.serve({
	cert: Deno.readTextFileSync('ca.crt'),
	key: Deno.readTextFileSync('ca.key'),
	/**
	 * Remove default logging to avoid clutter with previous instructions.
	 */
	onListen: () => {},
}, (request) => {
	const url = new URL(request.url)

	const code = url.searchParams.get('code')
	if (!code) {
		return new Response(null, { status: 404 })
	}

	switch (url.pathname) {
		case '/spotify':
			saveToken(
				code,
				'https://accounts.spotify.com/api/token',
				'spotify-token-data.json',
			)
			return new Response('Token saved to spotify-token-data.json', {
				status: 200,
			})
		case '/google':
			saveToken(
				code,
				'https://oauth2.googleapis.com/token',
				'google-token-data.json',
			)
			return new Response('Token saved to google-token-data.json', {
				status: 200,
			})
	}

	return new Response(null, { status: 404 })
})

async function saveToken(
	code: string,
	url: string,
	path: string,
): Promise<void> {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri,
				client_id: env.SPOTIFY_CLIENT_ID,
				code_verifier: codeVerifier,
			}),
		})
		if (!response.ok) {
			throw new Error('Error verifying token')
		}

		const token = await response.json()

		Deno.writeTextFileSync(
			path,
			JSON.stringify(token, null, 2),
		)
	} catch (exception) {
		console.error('Failed to save token')
		throw exception
	}
}

async function createCodeChallenge(verifier: string): Promise<string> {
	const textEncoder = new TextEncoder()
	const data = textEncoder.encode(verifier)
	const hash = await crypto.subtle.digest('SHA-256', data)
	return base64UrlEncode(new Uint8Array(hash))
}

function createCodeVerifier(): string {
	const array = new Uint8Array(32)
	crypto.getRandomValues(array)
	return base64UrlEncode(array)
}

function base64UrlEncode(array: Uint8Array): string {
	const base64 = btoa(String.fromCharCode(...array))
	return base64
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '')
}
