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
  const { handleOpen } = useOpenModalSearchParams()
  const { highlights } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenHighlight = (highlight: ReturnTypeHighlight) => {
    const nprofile = nip19.neventEncode({
      id: highlight.id,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: nprofile })
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
