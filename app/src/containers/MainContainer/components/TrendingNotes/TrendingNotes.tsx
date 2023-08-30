import { Container } from '@/layout/Container/Conatiner'
import { userService } from '@/store/services/user.service'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { TrendingNote } from '@/types/trending-notes'
import { SliderTrendingNotes } from '@/components/Slider/SliderTrendingNotes/SliderTrendingNotes'
import { StyledTitle, StyledWrapper } from './styled'

export const TrendingNotes = () => {
  const { data, isLoading } = userService.useFetchTrendingNotesQuery('')
  const { handleOpen } = useOpenModalSearchParams(MODAL_PARAMS_KEYS.SELECT_APP)

  const handleOpenProfile = (note: TrendingNote) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: note.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpen({ key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: nprofile })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Notes
        </StyledTitle>
      </Container>

      <SliderTrendingNotes data={data} isLoading={isLoading} handleClickEntity={handleOpenProfile} />
    </StyledWrapper>
  )
}
