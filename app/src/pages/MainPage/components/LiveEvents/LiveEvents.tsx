import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { SliderLiveEvents } from '@/components/Slider/SliderLiveEvents/SliderLiveEvents'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { LiveEvent } from '@/types/live-events'
import { nip19 } from '@nostrband/nostr-tools'
import { getTagValue, nostrbandRelay } from '@/modules/nostr'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'

export const LiveEvents = () => {
  const { liveEvents } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenLiveEvent = (event: LiveEvent) => {
    const naddr = nip19.naddrEncode({
      pubkey: event.pubkey,
      kind: event.kind,
      identifier: getTagValue(event, 'd'),
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], naddr] })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Live Streams
        </StyledTitle>
      </Container>
      <SliderLiveEvents data={liveEvents} isLoading={false} handleClickEntity={handleOpenLiveEvent} />
    </StyledWrapper>
  )
}
