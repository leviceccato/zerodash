import { Box, type DOMElement, Text } from 'ink'
import { useRef } from 'react'
import { useBoxSize } from '@/hooks/use-box-size.ts'

export function Progress(props: { value: number }): React.ReactNode {
	const rootRef = useRef<DOMElement>(null)
	const rootSize = useBoxSize(rootRef)

	return (
		<Box ref={rootRef} width='100%' height={1}>
			<Text>
				{Array.from({ length: rootSize.width }, (_, index) => {
					if (index === 0 || index === rootSize.width - 1) {
						return '|'
					}
					if (index < Math.floor(rootSize.width * props.value)) {
						return '='
					}
					return '-'
				})}
			</Text>
		</Box>
	)
}
