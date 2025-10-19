import { env } from '@/env.ts'

const redirectUri = 'https://127.0.0.1:8000'

const codeVerifier = createCodeVerifier()
const codeChallenge = await createCodeChallenge(codeVerifier)

const authSearchParams = new URLSearchParams({
	client_id: env.SPOTIFY_CLIENT_ID,
	response_type: 'code',
	redirect_uri: redirectUri,
	code_challenge_method: 'S256',
	code_challenge: codeChallenge,
	scope: 'user-read-currently-playing user-read-playback-state',
})

const authUrl =
	`https://accounts.spotify.com/authorize?${authSearchParams.toString()}`

console.log(
	`Authenticate Spotify using this URL: ${authUrl}`,
)

Deno.serve({
	cert: Deno.readTextFileSync('ca.crt'),
	key: Deno.readTextFileSync('ca.key'),
}, (request) => {
	const code = new URL(request.url).searchParams.get('code')
	if (!code) {
		return new Response(null, { status: 404 })
	}

	saveToken(code)
	return new Response('Token saved to spotify-token.json', { status: 200 })
})

async function saveToken(code: string): Promise<void> {
	try {
		const response = await fetch('https://accounts.spotify.com/api/token', {
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
			'spotify-token-data.json',
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
