import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { SliderBigZaps } from '@/components/Slider/SliderBigZaps/SliderBigZaps'
import { StyledTitle, StyledWrapper } from './styled'
import { ZapEvent } from '@/types/zap-event'

export const BigZaps = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { bigZaps } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenHighlight = (bigZap: ZapEvent) => {
    let addr = ''
    if (bigZap.targetEvent) {
      if (bigZap.targetEvent.kind === 0) {
        addr = nip19.nprofileEncode({
          pubkey: bigZap.targetEvent.pubkey,
          relays: [nostrbandRelay]
        })
      } else if (
        (bigZap.targetEvent.kind >= 10000 && bigZap.targetEvent.kind < 20000) ||
        (bigZap.targetEvent.kind >= 10000 && bigZap.targetEvent.kind < 20000)
      ) {
        addr = nip19.neventEncode({
          id: bigZap.targetEvent.pubkey,
          // kind: bigZap.targetEvent.kind,
          // identifier: bigZap.targetEvent.identifier,
          relays: [nostrbandRelay]
        })
      } else if (bigZap.targetMeta) {
        addr = nip19.neventEncode({
          id: bigZap.targetMeta.id,
          relays: [nostrbandRelay]
        })
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.plugins.toast.showShortBottom(`Target events not found`)
      }
    }

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: addr } })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Big Zaps
        </StyledTitle>
      </Container>

      <SliderBigZaps data={bigZaps || []} isLoading={bigZaps === null} handleClickEntity={handleOpenHighlight} />
    </StyledWrapper>
  )
}
