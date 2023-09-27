import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { SliderLiveEvents } from '@/components/Slider/SliderLiveEvents/SliderLiveEvents'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { LiveEvent } from '@/types/live-events'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedLiveEvents, getTagValue, nostrbandRelay } from '@/modules/nostr'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { setLiveEvents } from '@/store/reducers/contentWorkspace'
import { memo, useCallback } from 'react'

export const LiveEvents = memo(() => {
  const { liveEvents, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpen } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenLiveEvent = useCallback((event: LiveEvent) => {
    const naddr = nip19.naddrEncode({
      pubkey: event.pubkey,
      kind: event.kind,
      identifier: getTagValue(event, 'd'),
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: naddr } })
  }, [handleOpen])

  const handleReloadLiveEvents = useCallback(async () => {
    if (contactList) {
      dispatch(setLiveEvents({ liveEvents: null }))
      const liveEvents = await fetchFollowedLiveEvents(contactList.contactPubkeys).catch(() => {
        dispatch(setLiveEvents({ liveEvents: null }))
      })
      dispatch(setLiveEvents({ liveEvents }))
    }
  }, [dispatch, contactList])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Live Streams
        </StyledTitle>
      </Container>
      <SliderLiveEvents
        data={liveEvents || []}
        isLoading={liveEvents === null}
        handleClickEntity={handleOpenLiveEvent}
        handleReloadEntity={handleReloadLiveEvents}
      />
    </StyledWrapper>
  )
})
