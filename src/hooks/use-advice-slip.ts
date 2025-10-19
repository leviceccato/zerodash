import { z } from 'zod'

export function useAdviceSlip() {
	async function getAdvice(): Promise<
		z.output<typeof adviceSchema>
	> {
		const response = await fetch(
			'https://api.adviceslip.com/advice',
		)
		if (!response.ok) {
			throw new Error('Failed to fetch random quote')
		}

		const data = await response.json()

		return adviceSchema.parse(data)
	}

	return {
		getAdvice,
	}
}

const adviceSchema = z.object({
	slip: z.object({
		advice: z.string(),
	}),
})
