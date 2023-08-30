import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { getTagValue, nostrbandRelay } from '@/modules/nostr'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { Communitie } from '@/types/communities'
import { SliderCommunities } from '@/components/Slider/SliderCommunities/SliderCommunities'

export const Communities = () => {
  const { communities } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpen } = useOpenModalSearchParams(MODAL_PARAMS_KEYS.SELECT_APP)

  const handleOpenCommuniti = (note: Communitie) => {
    const naddr = nip19.naddrEncode({
      pubkey: note.pubkey,
      kind: note.kind,
      identifier: getTagValue(note, 'd'),
      relays: [nostrbandRelay]
    })

    handleOpen({ key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: naddr })
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