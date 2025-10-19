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
		ServiceData: z.string(),
		/**
		 * This is a typo in the API
		 */
		calcaulated_recycle_week: z.string(),
		Left: z.object({
			Bins: z.array(z.string()),
		}),
		Right: z.object({
			Bins: z.array(z.string()),
		}),
	})),
})
