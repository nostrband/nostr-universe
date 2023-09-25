import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedCommunities, getTagValue, nostrbandRelay } from '@/modules/nostr'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { CommunityEvent } from '@/types/communities'
import { SliderCommunities } from '@/components/Slider/SliderCommunities/SliderCommunities'
import { setCommunities } from '@/store/reducers/contentWorkspace'

export const Communities = () => {
  const { communities, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpen } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenCommuniti = (note: CommunityEvent) => {
    const naddr = nip19.naddrEncode({
      pubkey: note.pubkey,
      kind: note.kind,
      identifier: getTagValue(note, 'd'),
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: naddr } })
  }

  const handleReloadCommunities = async () => {
    if (contactList) {
      dispatch(setCommunities({ communities: null }))
      const communities = await fetchFollowedCommunities(contactList.contactPubkeys)
      dispatch(setCommunities({ communities }))
    }
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Active communities
        </StyledTitle>
      </Container>

      <SliderCommunities
        data={communities || []}
        isLoading={communities === null}
        handleClickEntity={handleOpenCommuniti}
        handleReloadEntity={handleReloadCommunities}
      />
    </StyledWrapper>
  )
}
