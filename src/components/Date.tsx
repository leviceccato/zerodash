import { Text } from 'ink'
import { useDate } from '@/hooks/use-date.ts'

export function Date(): React.ReactNode {
	const date = useDate({
		weekday: 'short',
		day: 'numeric',
		month: 'short',
	})

	return (
		<Text>
			{date}
		</Text>
	)
}
