import { Box, Text } from 'ink'
import { useZenQuotes } from '@/hooks/use-zen-quotes.ts'
import { usePoller } from '@/hooks/use-poller.ts'

const msIn24Hours = 86_400_000

export function ToDo(): React.ReactNode {
	const values = ['asd']

	const zenQuotes = useZenQuotes()

	const quotePoller = usePoller(zenQuotes.getRandomQuote, msIn24Hours)

	return (
		<Box flexDirection='column'>
			{values.length
				? (
					<>
						<Text>TODO</Text>
						{values.map((value) => <Text key={value}>- {value}</Text>)}
					</>
				)
				: quotePoller.state.type === 'success' &&
					(
						<>
							<Text>"{quotePoller.state.data[0].q}"</Text>
							<Text>{quotePoller.state.data[0].a}</Text>
						</>
					)}
		</Box>
	)
}
