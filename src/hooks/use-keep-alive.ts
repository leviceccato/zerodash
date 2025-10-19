/**
 * This is necessary to keep the TUI running otherwise
 * it will just exit immediately if no other effects
 * are running.
 */

import { useEffect } from 'react'

export function useKeepAlive(): void {
	useEffect(() => {
		const keepAlive = setInterval(() => {}, 1_000)
		return () => clearInterval(keepAlive)
	}, [])
}
