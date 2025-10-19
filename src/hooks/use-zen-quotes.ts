import { z } from 'zod'

export function useZenQuotes() {
	async function getRandomQuote(): Promise<
		z.output<typeof quoteSchema>
	> {
		const response = await fetch(
			'https://zenquotes.io/api/today',
		)
		if (!response.ok) {
			throw new Error('Failed to fetch random quote')
		}

		const data = await response.json()

		return quoteSchema.parse(data)
	}

	return {
		getRandomQuote,
	}
}

const quoteSchema = z.array(z.object({
	q: z.string(),
	a: z.string(),
})).min(1)
