import { useEffect, useState } from 'react'

export function usePoller<TData>(
	func: () => Promise<TData>,
	interval: number,
	isEnabled = true,
) {
	const [data, setData] = useState<TData>()

	useEffect(() => {
		if (!isEnabled) {
			return
		}

		let isActive = true

		async function poll(): Promise<void> {
			const result = await func()
			if (isActive) {
				setData(result)
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
		data,
	}
}
