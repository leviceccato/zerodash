import * as React from 'react'

type Props = {
	fallback: (error: Error) => React.ReactNode
	children: React.ReactNode
}

export class ErrorBoundary
	extends React.Component<Props, { error: Error | null }> {
	constructor(props: Props) {
		super(props)
		this.state = {
			error: null,
		}
	}

	static getDerivedStateFromError(error: Error) {
		return {
			error,
		}
	}

	override render() {
		if (this.state.error) {
			return this.props.fallback(this.state.error)
		}

		return this.props.children
	}
}
