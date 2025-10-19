import { useAdviceSlip } from '@/hooks/use-advice-slip.ts'
import { usePoller } from '@/hooks/use-poller.ts'
import { Text } from 'ink'

const msIn24Hours = 86_400_000

export function Advice(): React.ReactNode {
	const adviceSlip = useAdviceSlip()

	const advicePoller = usePoller(adviceSlip.getAdvice, msIn24Hours)

	return (
		<Text>
			{advicePoller.state.type === 'success'
				? `"${advicePoller.state.data.slip.advice}"`
				: ''}
		</Text>
	)
}
