import { useEffect, useState } from 'react'

export function usePoller<TData>(
	func: () => Promise<TData>,
	interval: number,
	isEnabled = true,
) {
	const [state, setState] = useState<
		{ type: 'success'; data: TData } | { type: 'loading' } | {
			type: 'error'
			error: Error
		}
	>({ type: 'loading' })

	useEffect(() => {
		if (!isEnabled) {
			return
		}

		let isActive = true

		async function poll(): Promise<void> {
			try {
				const result = await func()
				if (isActive) {
					setState({ type: 'success', data: result })
				}
			} catch (exception) {
				if (isActive) {
					setState({
						type: 'error',
						error: exception instanceof Error
							? exception
							: new Error('Unknown error'),
					})
				}
			}
		}

		poll()

		const intervalId = setInterval(poll, interval)

		return () => {
			isActive = false
			clearInterval(intervalId)
		}
	}, [interval, isEnabled])

	return {
		state,
	}
}
