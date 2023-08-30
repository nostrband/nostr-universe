import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { BigZap } from '@/types/big-zaps'
import { SliderBigZaps } from '@/components/Slider/SliderBigZaps/SliderBigZaps'
import { StyledTitle, StyledWrapper } from './styled'

export const BigZaps = () => {
  const { handleOpen } = useOpenModalSearchParams(MODAL_PARAMS_KEYS.SELECT_APP)
  const { bigZaps } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenHighlight = (bigZap: BigZap) => {
    let addr = ''
    if (typeof bigZap.targetEvent !== 'string') {
      if (bigZap.targetEvent?.kind === 0) {
        addr = nip19.nprofileEncode({
          pubkey: bigZap.targetEvent.pubkey,
          relays: [nostrbandRelay]
        })
      } else if (
        (bigZap.targetEvent?.kind >= 10000 && bigZap.targetEvent?.kind < 20000) ||
        (bigZap.targetEvent?.kind >= 10000 && bigZap.targetEvent?.kind < 20000)
      ) {
        addr = nip19.neventEncode({
          id: bigZap.targetEvent.pubkey,
          // kind: bigZap.targetEvent.kind,
          // identifier: bigZap.targetEvent.identifier,
          relays: [nostrbandRelay]
        })
      } else {
        addr = nip19.neventEncode({
          id: bigZap.targetMeta?.id,
          relays: [nostrbandRelay]
        })
      }
    }

    handleOpen({ key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: addr })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Big Zaps
        </StyledTitle>
      </Container>

      <SliderBigZaps data={bigZaps} isLoading={false} handleClickEntity={handleOpenHighlight} />
    </StyledWrapper>
  )
}
