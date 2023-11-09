import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { LiveEvent } from '@/types/live-events'
import { fetchFollowedLiveEvents } from '@/modules/nostr'
import { setLiveEvents } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonLiveEvents } from '@/components/Skeleton/SkeletonLiveEvents/SkeletonLiveEvents'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemLiveEvent } from '@/components/ItemsContent/ItemLiveEvent/ItemLiveEvent'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'

export const LiveEvents = memo(function LiveEvents() {
  const { liveEvents, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenLiveEvent = useCallback(
    (event: LiveEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const handleReloadLiveEvents = useCallback(async () => {
    if (contactList) {
      dispatch(setLiveEvents({ liveEvents: null }))
      const liveEvents = await fetchFollowedLiveEvents(contactList.contactPubkeys).catch(() => {
        dispatch(setLiveEvents({ liveEvents: null }))
      })
      dispatch(setLiveEvents({ liveEvents }))
    }
  }, [dispatch, contactList])

  const renderContent = useCallback(() => {
    if (liveEvents === null) {
      return <SkeletonLiveEvents />
    }

    if (!liveEvents || !liveEvents.length) {
      return <EmptyListMessage onReload={handleReloadLiveEvents} />
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
  }, [liveEvents, handleReloadLiveEvents, handleOpenLiveEvent])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Live Streams
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={225}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
