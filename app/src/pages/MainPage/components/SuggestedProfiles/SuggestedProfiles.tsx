import { SliderProfiles } from '@/components/Slider/SliderProfiles/SliderProfiles'
import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { userService } from '@/store/services/user.service'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { MetaEvent } from '@/types/meta-event'

export const SuggestedProfiles = () => {
  const { currentPubkey: currentPubKey } = useAppSelector((state) => state.keys)
  const {
    data,
    isFetching: isLoading,
    refetch: refetchSuggestedProfiles
  } = userService.useFetchSuggestedProfilesQuery(currentPubKey, {
    skip: !currentPubKey
  })
  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenProfile = (profile: MetaEvent) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: profile.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nprofile } })
  }

  const handleReloadSuggestedProfiles = () => refetchSuggestedProfiles()

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Suggested profiles
        </StyledTitle>
      </Container>

      <SliderProfiles
        data={data || []}
        isLoading={isLoading}
        handleClickEntity={handleOpenProfile}
        handleReloadEntity={handleReloadSuggestedProfiles}
      />
    </StyledWrapper>
  )
}
