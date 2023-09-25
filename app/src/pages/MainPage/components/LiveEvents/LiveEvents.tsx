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

export const LiveEvents = () => {
  const { liveEvents, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpen } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenLiveEvent = (event: LiveEvent) => {
    const naddr = nip19.naddrEncode({
      pubkey: event.pubkey,
      kind: event.kind,
      identifier: getTagValue(event, 'd'),
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: naddr } })
  }

  const handleReloadLiveEvents = async () => {
    if (contactList) {
      dispatch(setLiveEvents({ liveEvents: null }))
      const liveEvents = await fetchFollowedLiveEvents(contactList.contactPubkeys)
      dispatch(setLiveEvents({ liveEvents }))
    }
  }

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
}
