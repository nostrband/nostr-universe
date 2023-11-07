import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { CSSProperties, FC, useCallback } from 'react'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { fetchProfileListsThunk } from '@/store/reducers/bookmarks.slice'
import { useSigner } from '@/hooks/signer'
import { ProfileListItem } from './ProfileListItem/ProfileListItem'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { ProfileListEvent } from '@/types/profile-list-event'
import { SkeletonBookmarkLists } from '@/components/Skeleton/SkeletonBookmarkLists/SkeletonBookmarkLists'

export const ProfileLists = () => {
  const { profileLists, isProfileListsLoading } = useAppSelector((state) => state.bookmarks)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const { decrypt } = useSigner()
  const dispatch = useAppDispatch()
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const reloadProfileLists = useCallback(() => {
    dispatch(fetchProfileListsThunk({ pubkey: currentPubkey, decrypt }))
  }, [currentPubkey, dispatch, decrypt])

  const handleOpenProfile = useCallback(
    (event: ProfileListEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (isProfileListsLoading) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonBookmarkLists />
        </HorizontalSwipeContent>
      )
    }
    if (!profileLists.length && !isProfileListsLoading) {
      return <EmptyListMessage onReload={reloadProfileLists} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const profile = profileLists[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={profileLists.length}>
          <ProfileListItem {...profile} onClick={() => handleOpenProfile(profile)} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent
        itemHeight={100}
        itemSize={225}
        itemCount={profileLists.length}
        RowComponent={Row}
      />
    )
  }, [profileLists, isProfileListsLoading, reloadProfileLists, handleOpenProfile])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Profile Lists
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
}
