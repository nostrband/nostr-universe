import { Container } from '@/layout/Container/Conatiner'
import { userService } from '@/store/services/user.service'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { StyledTitle, StyledWrapper } from './styled'
import { AuthoredEvent } from '@/types/authored-event'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { ItemTrendingNote } from '@/components/ItemsContent/ItemTrendingNote/ItemTrendingNote'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { SkeletonTrendingNotes } from '@/components/Skeleton/SkeletonTrendingNotes/SkeletonTrendingNotes'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'

export const TrendingNotes = memo(function TrendingNotes() {
  const { data, isFetching: isLoading, refetch: refetchTrendingNotes } = userService.useFetchTrendingNotesQuery('')
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const handleOpenNote = useCallback(
    (note: AuthoredEvent) => {
      const ntrendingnote = nip19.neventEncode({
        relays: [nostrbandRelay],
        id: note.id
      })

      handleOpenContextMenu({ bech32: ntrendingnote })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonTrendingNotes />
        </HorizontalSwipeContent>
      )
    }

    if (!data || !data.length) {
      const handleReloadTrendingNotes = () => refetchTrendingNotes()
      return <EmptyListMessage onReload={handleReloadTrendingNotes} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const note = data[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={data.length}>
          <ItemTrendingNote
            onClick={() => handleOpenNote(note)}
            time={note.created_at}
            content={note.content}
            pubkey={note.pubkey}
            author={note.author}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return <HorizontalSwipeVirtualContent itemHight={113} itemSize={225} itemCount={data.length} RowComponent={Row} />
  }, [isLoading, refetchTrendingNotes, handleOpenNote, data])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Notes
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
