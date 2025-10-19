import { type DOMElement, measureElement } from 'ink'
import { useEffect, useState } from 'react'
import { usePoller } from '@/hooks/use-poller.ts'

export function useBoxSize(
	ref: React.RefObject<DOMElement | null>,
): {
	width: number
	height: number
} {
	const [size, setSize] = useState({
		width: 0,
		height: 0,
	})

	function updateSize(): Promise<void> {
		if (ref.current) {
			setSize(measureElement(ref.current))
		}
		return Promise.resolve()
	}

	usePoller(updateSize, 500)

	useEffect(() => {
		updateSize()
	}, [ref])

	return size
}
