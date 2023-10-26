import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { userService } from '@/store/services/user.service'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { Profile } from '@/shared/Profile/Profile'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'

export const TrendingProfiles = memo(function TrendingProfiles() {
  const {
    data,
    isFetching: isLoading,
    refetch: refetchTrendingProfiles
  } = userService.useFetchTrendingProfilesQuery('')
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const handleOpenProfile = useCallback(
    (pubkey: string) => {
      const nprofile = nip19.nprofileEncode({
        pubkey: pubkey,
        relays: [nostrbandRelay]
      })

      handleOpenContextMenu({ bech32: nprofile })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <HorizontalSwipeContent childrenWidth={140}>
          <SkeletonProfiles />
        </HorizontalSwipeContent>
      )
    }

    if (!data || !data.length) {
      const handleReloadTrendingProfiles = () => refetchTrendingProfiles()
      return <EmptyListMessage onReload={handleReloadTrendingProfiles} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const profile = data[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={data.length}>
          <Profile onClick={handleOpenProfile} profile={profile} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return <HorizontalSwipeVirtualContent itemHight={170} itemSize={140} itemCount={data.length} RowComponent={Row} />
  }, [isLoading, data, refetchTrendingProfiles, handleOpenProfile])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Profiles
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
