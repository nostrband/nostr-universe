import { Container } from '@/layout/Container/Conatiner'
import { userService } from '@/store/services/user.service'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { SliderTrendingNotes } from '@/components/Slider/SliderTrendingNotes/SliderTrendingNotes'
import { StyledTitle, StyledWrapper } from './styled'
import { AuthoredEvent } from '@/types/authored-event'

export const TrendingNotes = () => {
  const { data, isLoading } = userService.useFetchTrendingNotesQuery('')
  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenNote = (note: AuthoredEvent) => {
    const ntrendingnote = nip19.neventEncode({
      relays: [nostrbandRelay],
      id: note.id
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
      search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: ntrendingnote }
    })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Notes
        </StyledTitle>
      </Container>

      <SliderTrendingNotes data={data} isLoading={isLoading} handleClickEntity={handleOpenNote} />
    </StyledWrapper>
  )
}
