import { Text } from 'ink'
import { usePoller } from '@/hooks/use-poller.ts'
import { useMeteo } from '@/hooks/use-meteo.ts'

const msInHour = 3_600_000

export function Forecast(): React.ReactNode {
	const meteo = useMeteo()

	const poller = usePoller(meteo.getForecast, msInHour)

	const text = poller.state.type === 'success'
		? `${poller.state.data.current_weather?.temperature}° ${
			weatherCodeMap[poller.state.data.current_weather?.weather_code ?? 0]
		}`
		: ''

	return (
		<Text>
			{poller.state.type === 'loading'
				? 'Loading forecast'
				: poller.state.type === 'error'
				? 'Failed to load forecast'
				: text}
		</Text>
	)
}

const weatherCodeMap: Record<number, string> = {
	0: 'Clear',
	1: 'Mainly clear',
	2: 'Partly cloudy',
	3: 'Cloudy',
	45: 'Foggy',
	48: 'Rime fog',
	51: 'Light drizzle',
	53: 'Drizzle',
	55: 'Heavy drizzle',
	56: 'Light freezing drizzle',
	57: 'Freezing drizzle',
	61: 'Light rain',
	63: 'Rain',
	65: 'Heavy rain',
	66: 'Light freezing rain',
	67: 'Freezing rain',
	71: 'Light snow',
	73: 'Snow',
	75: 'Heavy snow',
	77: 'Snow grains',
	80: 'Light showers',
	81: 'Showers',
	82: 'Heavy showers',
	85: 'Light snow showers',
	86: 'Snow showers',
	95: 'Thunderstorm',
	96: 'Light thunderstorms with hail',
	99: 'Thunderstorm with hail',
}
