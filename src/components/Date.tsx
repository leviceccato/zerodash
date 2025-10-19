import { usePoller } from '@/hooks/use-poller.ts'
import { Text } from 'ink'

const msIn5Minutes = 300_000

export function Date(): React.ReactNode {
	const datePoller = usePoller(getDate, msIn5Minutes)

	function getDate(): Promise<string> {
		return Promise.resolve(
			Temporal.Now.plainDateISO().toLocaleString('en-AU', {
				weekday: 'short',
				day: 'numeric',
				month: 'short',
			}),
		)
	}

	return (
		<Text>
			{datePoller.state.type === 'success' ? datePoller.state.data : ''}
		</Text>
	)
}
