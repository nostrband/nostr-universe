import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { LongNoteEvent } from '@/types/long-note-event'
import { selectLongPosts } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonLongPosts } from '@/components/Skeleton/SkeletonLongPosts/SkeletonLongPosts'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemLongNote } from '@/components/ItemsContent/ItemLongNote/ItemLongNote'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useFeeds } from '@/hooks/feeds'

export const LongPosts = memo(function LongPosts() {
  const longPosts = useAppSelector(selectLongPosts)
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const { reloadLongPosts } = useFeeds()

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'longPosts'
      }
    })
  }

  const handleOpenLongPosts = useCallback(
    (event: LongNoteEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (longPosts === null) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonLongPosts />
        </HorizontalSwipeContent>
      )
    }
    if (!longPosts || !longPosts.length) {
      return <EmptyListMessage onReload={reloadLongPosts} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const longPost = longPosts[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={longPosts.length}>
          <ItemLongNote
            onClick={() => handleOpenLongPosts(longPost)}
            time={longPost.created_at}
            content={longPost.content}
            subtitle={longPost.title}
            pubkey={longPost.pubkey}
            author={longPost.author}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent itemHeight={113} itemSize={225} itemCount={longPosts.length} RowComponent={Row} />
    )
  }, [longPosts, reloadLongPosts, handleOpenLongPosts])

  const isVisible = Boolean(longPosts && longPosts.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Long posts
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
})
