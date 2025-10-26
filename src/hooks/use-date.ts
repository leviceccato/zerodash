import { usePoller } from '@/hooks/use-poller.ts'

const msIn5Minutes = 300_000

export function useDate(options: Intl.DateTimeFormatOptions): string {
	const datePoller = usePoller(getDate, msIn5Minutes)

	function getDate(): Promise<string> {
		return Promise.resolve(
			Temporal.Now.plainDateISO().toLocaleString('en-AU', options),
		)
	}

	return datePoller.data ? datePoller.data : 'Invalid date'
}
