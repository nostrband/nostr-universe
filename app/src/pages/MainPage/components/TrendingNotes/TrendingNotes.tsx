import { Container } from '@/layout/Container/Conatiner'
import { userService } from '@/store/services/user.service'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { StyledTitle, StyledWrapper } from './styled'
import { AuthoredEvent } from '@/types/authored-event'
import { memo, useCallback } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { ItemTrendingNote } from '@/components/ItemsContent/ItemTrendingNote/ItemTrendingNote'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { SkeletonTrendingNotes } from '@/components/Skeleton/SkeletonTrendingNotes/SkeletonTrendingNotes'

export const TrendingNotes = memo(function TrendingNotes() {
  const { data, isFetching: isLoading, refetch: refetchTrendingNotes } = userService.useFetchTrendingNotesQuery('')
  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenNote = useCallback((note: AuthoredEvent) => {
    const ntrendingnote = nip19.neventEncode({
      relays: [nostrbandRelay],
      id: note.id
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
      search: {
        [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: ntrendingnote,
        [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(note.kind)
      }
    })
  }, [handleOpen])


  const renderContent = useCallback(() => {
    if (isLoading) {
      return <SkeletonTrendingNotes />
    }
    if (!data || !data.length) {
      const handleReloadTrendingNotes = () => refetchTrendingNotes()
      return <EmptyListMessage onReload={handleReloadTrendingNotes} />
    }
    return data.map((note, i) => (
      <ItemTrendingNote
        onClick={() => handleOpenNote(note)}
        key={i}
        time={note.created_at}
        content={note.content}
        pubkey={note.pubkey}
        author={note.author}
      />
    ))
  }, [isLoading, refetchTrendingNotes, handleOpenNote, data])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Notes
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={225}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
