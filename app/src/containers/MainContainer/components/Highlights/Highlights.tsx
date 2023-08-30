import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { SliderHighlights } from '@/components/Slider/SliderHighlights/SliderHighlights'
import { StyledTitle, StyledWrapper } from './styled'
import { ReturnTypeHighlight } from '@/types/contentWorkSpace'

export const Highlights = () => {
  const { handleOpen } = useOpenModalSearchParams(MODAL_PARAMS_KEYS.SELECT_APP)
  const { highlights } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenHighlight = (highlight: ReturnTypeHighlight) => {
    console.log({ highlight })
    const nprofile = nip19.nprofileEncode({
      pubkey: highlight.id,
      relays: [nostrbandRelay]
    })

    handleOpen({ key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: nprofile })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Highlights
        </StyledTitle>
      </Container>

      <SliderHighlights data={highlights} isLoading={false} handleClickEntity={handleOpenHighlight} />
    </StyledWrapper>
  )
}
