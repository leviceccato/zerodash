import { Box, Text } from 'ink'
import { Image } from '@/components/Image.tsx'
import { Progress } from '@/components/Progress.tsx'
import { useSpotify } from '@/hooks/use-spotify.ts'
import { usePoller } from '@/hooks/use-poller.ts'

export function SpotifyPlayer(
	props: { boxProps?: React.ComponentProps<typeof Box> },
): React.ReactNode {
	const spotify = useSpotify()

	const playbackStatePoller = usePoller(
		spotify.getPlaybackState,
		5_000,
	)

	return (
		<Box {...props.boxProps} flexDirection='column' rowGap={1}>
			<Image
				src={playbackStatePoller.state.type === 'success'
					? playbackStatePoller.state.data.item?.album?.images?.[0].url
					: undefined}
				boxProps={{ borderStyle: 'classic' }}
				ratio={0.4}
			/>
			<Text>
				{playbackStatePoller.state.type === 'success'
					? `${playbackStatePoller.state.data.item?.name} - ${
						playbackStatePoller.state.data.item?.artists?.map((
							artist,
						) => artist.name).join(', ')
					}`
					: 'No track playing'}
			</Text>
			<Box columnGap={1} padding={0}>
				<Box minWidth={2}>
					<Text>
						{playbackStatePoller.state.type === 'success'
							? playbackStatePoller.state.data.is_playing ? '|>' : '||'
							: '[]'}
					</Text>
				</Box>
				<Progress
					value={playbackStatePoller.state.type === 'success'
						? ((playbackStatePoller.state.data.progress_ms || 0) /
							(playbackStatePoller.state.data.item?.duration_ms || 1))
						: 0}
				/>
			</Box>
		</Box>
	)
}
