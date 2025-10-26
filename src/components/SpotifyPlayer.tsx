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
				src={playbackStatePoller.data?.item?.album?.images?.[0].url}
				boxProps={{ borderStyle: 'classic' }}
				ratio={0.4}
			/>
			<Text>
				{playbackStatePoller.data
					? `${playbackStatePoller.data.item?.name} - ${
						playbackStatePoller.data.item?.artists?.map((
							artist,
						) => artist.name).join(', ')
					}`
					: 'No track playing'}
			</Text>
			<Box columnGap={1} padding={0}>
				<Box minWidth={2}>
					<Text>
						{playbackStatePoller.data
							? playbackStatePoller.data.is_playing ? '|>' : '||'
							: '[]'}
					</Text>
				</Box>
				<Progress
					value={playbackStatePoller.data
						? ((playbackStatePoller.data.progress_ms || 0) /
							(playbackStatePoller.data.item?.duration_ms || 1))
						: 0}
				/>
			</Box>
		</Box>
	)
}
