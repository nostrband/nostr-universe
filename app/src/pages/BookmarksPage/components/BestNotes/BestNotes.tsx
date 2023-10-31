import { CSSProperties, FC, useCallback } from 'react'
import { StyledTitle, StyledWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'

import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { fetchBestNotesThunk } from '@/store/reducers/bookmarks.slice'
import { BestNoteItem } from './BestNoteItem/BestNoteItem'
import { AuthoredEvent } from '@/types/authored-event'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonTrendingNotes } from '@/components/Skeleton/SkeletonTrendingNotes/SkeletonTrendingNotes'
import { nip19 } from '@nostrband/nostr-tools'
import { useOpenModalSearchParams } from '@/hooks/modal'

const BestNotes = () => {
  const { bestNotes, isBestNotesLoading } = useAppSelector((state) => state.bookmarks)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const dispatch = useAppDispatch()
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const reloadBestNotes = useCallback(() => {
    dispatch(fetchBestNotesThunk(currentPubkey))
  }, [currentPubkey, dispatch])

  const handleOpenNote = useCallback(
    (note: AuthoredEvent) => {
      const noteId = nip19.neventEncode({
        relays: [nostrbandRelay],
        id: note.id
      })

      handleOpenContextMenu({ bech32: noteId })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (isBestNotesLoading) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonTrendingNotes />
        </HorizontalSwipeContent>
      )
    }
    if (!bestNotes.length && !isBestNotesLoading) {
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
      <HorizontalSwipeVirtualContent itemHight={125} itemSize={225} itemCount={bestNotes.length} RowComponent={Row} />
    )
  }, [bestNotes, handleOpenNote, isBestNotesLoading, reloadBestNotes])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Favorite Notes
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
}

export default BestNotes
