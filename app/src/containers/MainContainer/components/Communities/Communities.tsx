import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { Communitie } from '@/types/communities'
import { SliderCommunities } from '@/components/Slider/SliderCommunities/SliderCommunities'

export const Communities = () => {
  const { communities } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpen } = useOpenModalSearchParams(MODAL_PARAMS_KEYS.SELECT_APP)

  const handleOpenCommuniti = (note: Communitie) => {
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
          Active communities
        </StyledTitle>
      </Container>

      <SliderCommunities data={communities} isLoading={false} handleClickEntity={handleOpenCommuniti} />
    </StyledWrapper>
  )
}
