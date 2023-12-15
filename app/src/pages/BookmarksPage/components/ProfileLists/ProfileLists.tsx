import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { CSSProperties, FC, useCallback } from 'react'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { selectProfileLists } from '@/store/reducers/bookmarks.slice'
import { ProfileListItem } from './ProfileListItem/ProfileListItem'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { ProfileListEvent } from '@/types/profile-list-event'
import { SkeletonBookmarkLists } from '@/components/Skeleton/SkeletonBookmarkLists/SkeletonBookmarkLists'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useFeeds } from '@/hooks/feeds'

export const ProfileLists = () => {
  const profileLists = useAppSelector(selectProfileLists)
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const { reloadProfileLists } = useFeeds()

  const handleOpenProfile = useCallback(
    (event: ProfileListEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'profileLists'
      }
    })
  }

  const renderContent = useCallback(() => {
    if (!profileLists) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonBookmarkLists />
        </HorizontalSwipeContent>
      )
    }
    if (!profileLists.length) {
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
  }, [profileLists, reloadProfileLists, handleOpenProfile])

  const isVisible = Boolean(profileLists && profileLists.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Profile Lists
          {isVisible && (
            <IconButton color="light" size="small" onClick={handleOpenFeedModal}>
              <OpenInFullOutlinedIcon fontSize="inherit" />
            </IconButton>
          )}
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
}
