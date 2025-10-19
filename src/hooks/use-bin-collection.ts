import { env } from '@/env.ts'
import { z } from 'zod'

export function useBinCollection() {
	async function getDate(): Promise<z.output<typeof binCollectionSchema>> {
		const response = await fetch(
			`https://mitownsville.service-now.com/api/cio19/bin_collection_dates/getBinCollectionDate?p_id=${env.PROPERTY_ID}`,
		)
		if (!response.ok) {
			throw new Error('Failed to fetch bin collection data')
		}

		const data = await response.json()

		return binCollectionSchema.parse(data)
	}

	return {
		getDate,
	}
}

const binCollectionSchema = z.object({
	result: z.array(z.object({
		ServiceDay: z.enum([
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		]),
		Left: z.object({
			Text: z.enum(['This Week', 'Next Week']),
			Bins: z.tuple([z.literal('Rubbish')]),
		}),
		Right: z.object({
			Text: z.enum(['This Week', 'Next Week']),
			Bins: z.tuple([z.literal('Rubbish'), z.literal('Recycle')]),
		}),
	})),
})
