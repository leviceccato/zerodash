import { useRef } from 'react'
import createClient from 'openapi-fetch'
import type { paths } from '@/meteo.d.ts'
import { env } from '@/env.ts'
import type { ApiResponse } from '@/openapi.ts'

export type Forecast = ApiResponse<paths, '/v1/forecast', 'get'>

export function useMeteo() {
	const meteo = useRef(createClient<paths>({
		baseUrl: 'https://api.open-meteo.com',
	}))

	async function getForecast(): Promise<Forecast> {
		const response = await meteo.current.GET('/v1/forecast', {
			params: {
				query: {
					latitude: env.LATITUDE,
					longitude: env.LONGITUDE,
					current_weather: true,
				},
			},
		})

		if (response.error?.error || !response.data) {
			throw new Error(response.error.reason ?? 'Error fetching forecase')
		}

		return response.data
	}

	return {
		getForecast,
	}
}
