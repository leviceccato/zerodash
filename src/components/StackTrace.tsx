import { Box, Text } from 'ink'

export function StackTrace(
	props: {
		error?: Error
		boxProps?: React.ComponentProps<typeof Box>
	},
): React.ReactNode {
	if (!props.error) {
		return null
	}

	return (
		<Box paddingX={3} paddingY={1} {...props.boxProps}>
			<Text>
				{props.error.stack}
			</Text>
		</Box>
	)
}
