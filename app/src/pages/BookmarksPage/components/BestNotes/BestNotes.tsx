import { CSSProperties, FC, useCallback } from 'react'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'

import { useAppSelector } from '@/store/hooks/redux'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { selectBestNotes } from '@/store/reducers/bookmarks.slice'
import { BestNoteItem } from './BestNoteItem/BestNoteItem'
import { AuthoredEvent } from '@/types/authored-event'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonTrendingNotes } from '@/components/Skeleton/SkeletonTrendingNotes/SkeletonTrendingNotes'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { getEventNip19 } from '@/modules/nostr'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useFeeds } from '@/hooks/feeds'

const BestNotes = () => {
  const bestNotes = useAppSelector(selectBestNotes)
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const { reloadBestNotes } = useFeeds()

  const handleOpenNote = useCallback(
    (note: AuthoredEvent) => {
      const noteId = getEventNip19(note)

      handleOpenContextMenu({ bech32: noteId })
    },
    [handleOpenContextMenu]
  )

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'bestNotes'
      }
    })
  }

  const renderContent = useCallback(() => {
    if (!bestNotes) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonTrendingNotes />
        </HorizontalSwipeContent>
      )
    }
    if (!bestNotes.length) {
      return <EmptyListMessage onReload={reloadBestNotes} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const note = bestNotes[index]
      const noteTargetEvent = note.targetEvent as AuthoredEvent
      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={bestNotes.length}>
          <BestNoteItem
            onClick={() => handleOpenNote(noteTargetEvent)}
            pubkey={noteTargetEvent.pubkey}
            author={noteTargetEvent.author}
            content={noteTargetEvent.content}
            time={noteTargetEvent.created_at}
            reactionKind={note.kind}
            reactionTime={note.created_at}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent itemHeight={125} itemSize={225} itemCount={bestNotes.length} RowComponent={Row} />
    )
  }, [bestNotes, handleOpenNote, reloadBestNotes])

  const isVisible = Boolean(bestNotes && bestNotes.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Favorite Notes
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

export default BestNotes
