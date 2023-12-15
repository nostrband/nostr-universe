import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { SkeletonLongPosts } from '@/components/Skeleton/SkeletonLongPosts/SkeletonLongPosts'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { CSSProperties, FC, useCallback } from 'react'
import { LongNoteEvent } from '@/types/long-note-event'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { BestLongNoteItem } from './BestLongNoteItem/BestLongNoteItem'
import { useAppSelector } from '@/store/hooks/redux'
import { selectBestLongNotes } from '@/store/reducers/bookmarks.slice'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useFeeds } from '@/hooks/feeds'

export const BestLongNotes = () => {
  const bestLongNotes = useAppSelector(selectBestLongNotes)
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const { reloadBestLongNotes } = useFeeds()

  const handleOpenLongPosts = useCallback(
    (event: LongNoteEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'bestLongNotes'
      }
    })
  }

  const renderContent = useCallback(() => {
    if (!bestLongNotes) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonLongPosts />
        </HorizontalSwipeContent>
      )
    }
    if (!bestLongNotes.length) {
      return <EmptyListMessage onReload={reloadBestLongNotes} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const longNote = bestLongNotes[index]
      const longNoteTargetEvent = longNote.targetEvent as LongNoteEvent
      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={bestLongNotes.length}>
          <BestLongNoteItem
            onClick={() => handleOpenLongPosts(longNoteTargetEvent)}
            pubkey={longNoteTargetEvent.pubkey}
            author={longNoteTargetEvent.author}
            content={longNoteTargetEvent.content}
            time={longNoteTargetEvent.created_at}
            reactionKind={longNote.kind}
            reactionTime={longNote.created_at}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent
        itemHeight={125}
        itemSize={225}
        itemCount={bestLongNotes.length}
        RowComponent={Row}
      />
    )
  }, [bestLongNotes, handleOpenLongPosts, reloadBestLongNotes])

  const isVisible = Boolean(bestLongNotes && bestLongNotes.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Favorite Long Posts
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
