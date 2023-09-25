import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { SliderHighlights } from '@/components/Slider/SliderHighlights/SliderHighlights'
import { StyledTitle, StyledWrapper } from './styled'
import { HighlightEvent } from '@/types/highlight-event'

export const Highlights = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { highlights } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenHighlight = (highlight: HighlightEvent) => {
    const nevent = nip19.neventEncode({
      id: highlight.id,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nevent } })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Highlights
        </StyledTitle>
      </Container>

      <SliderHighlights
        data={highlights || []}
        isLoading={highlights === null}
        handleClickEntity={handleOpenHighlight}
      />
    </StyledWrapper>
  )
}
