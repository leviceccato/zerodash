import { Text } from 'ink'
import figlet, { type FigletOptions } from 'figlet'
import { useEffect, useState } from 'react'

export function BigText(
	props: {
		value?: string
		options?: FigletOptions
		textProps?: React.ComponentProps<typeof Text>
	},
): React.ReactNode {
	const [text, setText] = useState('')

	useEffect(() => {
		if (!props.value) {
			return
		}

		figlet(props.value, props.options ?? {}, (error, data) => {
			if (error || !data) {
				throw error || new Error("Couldn't generate text data")
			}
			setText(data)
		})
	}, [props.value])

	return <Text {...props.textProps}>{text}</Text>
}
