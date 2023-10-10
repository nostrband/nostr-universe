import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { LiveEvent } from '@/types/live-events'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedLiveEvents, getTagValue, nostrbandRelay } from '@/modules/nostr'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { setLiveEvents } from '@/store/reducers/contentWorkspace'
import { memo, useCallback } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonLiveEvents } from '@/components/Skeleton/SkeletonLiveEvents/SkeletonLiveEvents'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemLiveEvent } from '@/components/ItemsContent/ItemLiveEvent/ItemLiveEvent'

export const LiveEvents = memo(function LiveEvents() {
  const { liveEvents, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpen } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenLiveEvent = useCallback(
    (event: LiveEvent) => {
      const naddr = nip19.naddrEncode({
        pubkey: event.pubkey,
        kind: event.kind,
        identifier: getTagValue(event, 'd'),
        relays: [nostrbandRelay]
      })

      handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
        search: {
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: naddr,
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(event.kind)
        }
      })
    },
    [handleOpen]
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

  const renderContent = () => {
    if (liveEvents === null) {
      return <SkeletonLiveEvents />
    }
    if (!liveEvents || !liveEvents.length) {
      return <EmptyListMessage onReload={handleReloadLiveEvents} />
    }
    return liveEvents.map((event, i) => (
      <ItemLiveEvent
        key={i}
        onClick={() => handleOpenLiveEvent(event)}
        time={event.starts || event.created_at}
        hostPubkey={event.host}
        host={event.hostMeta}
        subtitle={event.title}
        content={event.summary || event.content.substring(0, 300)}
        status={event.status}
      />
    ))
  }

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
