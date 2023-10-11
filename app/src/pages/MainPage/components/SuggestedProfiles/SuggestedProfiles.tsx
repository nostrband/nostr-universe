import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { userService } from '@/store/services/user.service'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { MetaEvent } from '@/types/meta-event'
import { memo, useCallback } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { Profile } from '@/shared/Profile/Profile'

export const SuggestedProfiles = memo(function SuggestedProfiles() {
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const {
    data,
    isFetching: isLoading,
    refetch: refetchSuggestedProfiles
  } = userService.useFetchSuggestedProfilesQuery(currentPubkey, {
    skip: !currentPubkey
  })
  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenProfile = useCallback(
    (profile: MetaEvent) => {
      const nprofile = nip19.nprofileEncode({
        pubkey: profile.pubkey,
        relays: [nostrbandRelay]
      })

      handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
        search: {
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nprofile,
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(profile.kind)
        }
      })
    },
    [handleOpen]
  )

  const renderContent = useCallback(() => {
    if (isLoading) {
      return <SkeletonProfiles />
    }
    if (!data || !data.length) {
      const handleReloadSuggestedProfiles = () => refetchSuggestedProfiles()
      return <EmptyListMessage onReload={handleReloadSuggestedProfiles} />
    }
    return data.map((profile, i) => <Profile key={i} onClick={handleOpenProfile} profile={profile} />)
  }, [isLoading, data, handleOpenProfile, refetchSuggestedProfiles])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Suggested profiles
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={140}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
