import { Box, type DOMElement } from 'ink'
import { ToDo } from '@/components/ToDo.tsx'
import { SpotifyPlayer } from '@/components/SpotifyPlayer.tsx'
import { Date } from '@/components/Date.tsx'
import { Advice } from '@/components/Advice.tsx'
import { Forecast } from '@/components/Forecast.tsx'
import { useRef } from 'react'
import { useKeepAlive } from '@/hooks/use-keep-alive.ts'
import { useBoxSize } from '@/hooks/use-box-size.ts'

export function App(): React.ReactNode {
	const consoleSize = Deno.consoleSize()

	const playerRef = useRef<DOMElement>(null)

	const playerSize = useBoxSize(playerRef)

	useKeepAlive()

	return (
		<Box
			width='100%'
			height={consoleSize.rows}
			flexDirection='row'
			alignItems='center'
			justifyContent='center'
			gap={15}
		>
			<SpotifyPlayer boxProps={{ width: 27, ref: playerRef }} />
			<Box width={27} height={playerSize.height} flexDirection='column' gap={1}>
				<Box flexDirection='column'>
					<Date />
					<Forecast />
				</Box>
				<ToDo />
			</Box>
			<Box width={27} height={playerSize.height} flexDirection='column' gap={1}>
				<Advice />
			</Box>
		</Box>
	)
}
