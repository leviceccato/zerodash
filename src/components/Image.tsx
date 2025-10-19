import terminalImage from 'terminal-image'
import { Box, type DOMElement, Text } from 'ink'
import { useEffect, useRef, useState } from 'react'
import { useBoxSize } from '@/hooks/use-box-size.ts'

export function Image(
	props: {
		src?: string
		ratio: number
		boxProps?: React.ComponentProps<typeof Box>
	},
): React.ReactNode {
	const rootRef = useRef<DOMElement>(null)
	const rootSize = useBoxSize(rootRef)

	const height = Math.floor(rootSize.width * props.ratio)

	const [state, setState] = useState<
		| { type: 'loading' }
		| { type: 'error'; error: Error }
		| { type: 'success'; data: string }
	>({ type: 'loading' })

	useEffect(() => {
		if (!props.src) {
			return
		}

		fetch(props.src).then(async (response) => {
			if (!response.ok) {
				throw new Error('Failed to get image')
			}

			const imageBuffer = await response.bytes()

			setState({
				type: 'success',
				data: await terminalImage.buffer(imageBuffer, {
					width: rootSize.width,
					height,
					preserveAspectRatio: false,
				}),
			})
		}).catch((exception) => {
			setState({
				type: 'error',
				error: exception instanceof Error
					? exception
					: new Error('Unknown error'),
			})
		})
	}, [props.src])

	return (
		<>
			{state.type !== 'success'
				? (
					<Box
						{...props.boxProps}
						ref={rootRef}
						height={height}
					/>
				)
				: <Text>{state.data}</Text>}
		</>
	)
}
