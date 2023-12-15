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
import { selectBookmarkLists } from '@/store/reducers/bookmarks.slice'
import { BookmarkListItem } from './BookmarkListItem/BookmarkListItem'
import { BookmarkListEvent } from '@/types/bookmark-list-event'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { SkeletonBookmarkLists } from '@/components/Skeleton/SkeletonBookmarkLists/SkeletonBookmarkLists'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useFeeds } from '@/hooks/feeds'

export const BookmarkLists = () => {
  const bookmarkLists = useAppSelector(selectBookmarkLists)
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const { reloadBookmarkLists } = useFeeds()

  const handleOpenBookmark = useCallback(
    (event: BookmarkListEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'bookmarkLists'
      }
    })
  }

  const renderContent = useCallback(() => {
    if (!bookmarkLists) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonBookmarkLists />
        </HorizontalSwipeContent>
      )
    }
    if (!bookmarkLists.length) {
      return <EmptyListMessage onReload={reloadBookmarkLists} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const bookmark = bookmarkLists[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={bookmarkLists.length}>
          <BookmarkListItem {...bookmark} onClick={() => handleOpenBookmark(bookmark)} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent
        itemHeight={100}
        itemSize={225}
        itemCount={bookmarkLists.length}
        RowComponent={Row}
      />
    )
  }, [bookmarkLists, reloadBookmarkLists, handleOpenBookmark])

  const isVisible = Boolean(bookmarkLists && bookmarkLists.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Bookmark Lists
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
