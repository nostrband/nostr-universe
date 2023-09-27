import { Container } from '@/layout/Container/Conatiner'
import { userService } from '@/store/services/user.service'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { SliderTrendingNotes } from '@/components/Slider/SliderTrendingNotes/SliderTrendingNotes'
import { StyledTitle, StyledWrapper } from './styled'
import { AuthoredEvent } from '@/types/authored-event'
import { useCallback } from 'react'

export const TrendingNotes = () => {
  const { data, isFetching: isLoading, refetch: refetchTrendingNotes } = userService.useFetchTrendingNotesQuery('')
  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenNote = useCallback((note: AuthoredEvent) => {
    const ntrendingnote = nip19.neventEncode({
      relays: [nostrbandRelay],
      id: note.id
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
      search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: ntrendingnote }
    })
  }, [])

  const handleReloadTrendingNotes = () => refetchTrendingNotes()

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Notes
        </StyledTitle>
      </Container>

      <SliderTrendingNotes
        data={data}
        isLoading={isLoading}
        handleClickEntity={handleOpenNote}
        handleReloadEntity={handleReloadTrendingNotes}
      />
    </StyledWrapper>
  )
}
