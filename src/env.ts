import { z } from 'zod'
import { daySchema } from '@/schema.ts'

export const env = z.object({
	SPOTIFY_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	LATITUDE: z.coerce.number(),
	LONGITUDE: z.coerce.number(),
	WATER_DAYS: z.string().transform((value) => value.split(',')).pipe(
		z.array(daySchema),
	),
	/**
	 * This can be obtained by visiting: https://www.townsville.qld.gov.au/water-waste-and-environment/waste-and-recycling/bin-collection-days
	 * You can see the property ID queried after you select your address.
	 */
	PROPERTY_ID: z.string(),
}).parse(Deno.env.toObject())
