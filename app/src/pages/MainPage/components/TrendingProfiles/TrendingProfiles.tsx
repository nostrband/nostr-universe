import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { userService } from '@/store/services/user.service'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { MetaEvent } from '@/types/meta-event'
import { memo, useCallback } from 'react'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { Profile } from '@/shared/Profile/Profile'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'

export const TrendingProfiles = memo(function TrendingProfiles() {
  const {
    data,
    isFetching: isLoading,
    refetch: refetchTrendingProfiles
  } = userService.useFetchTrendingProfilesQuery('')
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const handleOpenProfile = useCallback(
    (profile: MetaEvent) => {
      const nprofile = nip19.nprofileEncode({
        pubkey: profile.pubkey,
        relays: [nostrbandRelay]
      })

      handleOpenContextMenu({ bech32: nprofile })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (isLoading) {
      return <SkeletonProfiles />
    }
    if (!data || !data.length) {
      const handleReloadTrendingProfiles = () => refetchTrendingProfiles()
      return <EmptyListMessage onReload={handleReloadTrendingProfiles} />
    }
    return data.map((profile, i) => <Profile key={i} onClick={handleOpenProfile} profile={profile} />)
  }, [isLoading, data, refetchTrendingProfiles, handleOpenProfile])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Profiles
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={140}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
