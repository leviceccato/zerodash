import { Box, Text } from 'ink'
import { usePoller } from '@/hooks/use-poller.ts'
import { useBinCollection } from '@/hooks/use-bin-collection.ts'
import { useDate } from '@/hooks/use-date.ts'
import { env } from '@/env.ts'

const msIn24Hours = 86_400_000

export function ToDo(): React.ReactNode {
	const binCollection = useBinCollection()

	const binCollectionPoller = usePoller(binCollection.getDate, msIn24Hours)
	const date = useDate({
		weekday: 'long',
	})

	const todos: {
		text: string
		color: React.ComponentProps<typeof Text>['color']
	}[] = []

	if (
		date === binCollectionPoller.data?.result[0].ServiceDay
	) {
		const bins = binCollectionPoller.data.result[0].Left.Text === 'This Week'
			? binCollectionPoller.data.result[0].Left.Bins
			: binCollectionPoller.data.result[0].Right.Bins

		for (const bin of bins) {
			todos.push({
				text: bin,
				color: bin === 'Rubbish' ? 'redBright' : 'yellow',
			})
		}
	}

	if (env.WATER_DAYS.some((day) => day === date)) {
		todos.push({
			text: 'Water',
			color: 'blueBright',
		})
	}

	return (
		<Box flexDirection='column'>
			{todos.length
				? (
					<>
						<Text>TODO</Text>
						{todos.map((todo) => (
							<Box>
								<Box minWidth={2}>
									<Text>-</Text>
								</Box>
								<Text key={todo.text} color={todo.color}>{todo.text}</Text>
							</Box>
						))}
					</>
				)
				: null}
		</Box>
	)
}
