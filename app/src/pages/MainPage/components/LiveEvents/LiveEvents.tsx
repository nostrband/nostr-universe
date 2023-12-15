import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { LiveEvent } from '@/types/live-events'
import { selectLiveEvets } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonLiveEvents } from '@/components/Skeleton/SkeletonLiveEvents/SkeletonLiveEvents'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemLiveEvent } from '@/components/ItemsContent/ItemLiveEvent/ItemLiveEvent'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useFeeds } from '@/hooks/feeds'

export const LiveEvents = memo(function LiveEvents() {
  const liveEvents = useAppSelector(selectLiveEvets)
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const { reloadLiveEvents } = useFeeds()

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'liveEvents'
      }
    })
  }

  const handleOpenLiveEvent = useCallback(
    (event: LiveEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (liveEvents === null) {
      return <SkeletonLiveEvents />
    }

    if (!liveEvents || !liveEvents.length) {
      return <EmptyListMessage onReload={reloadLiveEvents} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const event = liveEvents[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={liveEvents.length}>
          <ItemLiveEvent
            onClick={() => handleOpenLiveEvent(event)}
            time={event.starts || event.created_at}
            hostPubkey={event.host}
            host={event.hostMeta}
            subtitle={event.title}
            content={event.summary || event.content.substring(0, 300)}
            status={event.status}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent itemHeight={113} itemSize={225} itemCount={liveEvents.length} RowComponent={Row} />
    )
  }, [liveEvents, reloadLiveEvents, handleOpenLiveEvent])

  const isVisible = Boolean(liveEvents && liveEvents.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Live Streams
          {isVisible && (
            <IconButton color="light" size="small" onClick={handleOpenFeedModal}>
              <OpenInFullOutlinedIcon fontSize="inherit" />
            </IconButton>
          )}
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={225}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
