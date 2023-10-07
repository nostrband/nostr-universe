import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedLongNotes, getTagValue, nostrbandRelay } from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { LongNoteEvent } from '@/types/long-note-event'
import { setLongPosts } from '@/store/reducers/contentWorkspace'
import { memo, useCallback } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonLongPosts } from '@/components/Skeleton/SkeletonLongPosts/SkeletonLongPosts'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemLongNote } from '@/components/ItemsContent/ItemLongNote/ItemLongNote'

export const LongPosts = memo(function LongPosts() {
  const { handleOpen } = useOpenModalSearchParams()
  const { longPosts, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const dispatch = useAppDispatch()

  const handleOpenLongPosts = useCallback(
    (longPost: LongNoteEvent) => {
      const naddr = nip19.naddrEncode({
        pubkey: longPost.pubkey,
        kind: longPost.kind,
        identifier: getTagValue(longPost, 'd'),
        relays: [nostrbandRelay]
      })

      handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: naddr } })
    },
    [handleOpen]
  )

  const handleReloadLongPosts = useCallback(async () => {
    if (contactList) {
      dispatch(setLongPosts({ longPosts: null }))
      const longPosts = await fetchFollowedLongNotes(contactList.contactPubkeys).catch(() => {
        dispatch(setLongPosts({ longPosts: null }))
      })
      dispatch(setLongPosts({ longPosts }))
    }
  }, [dispatch, contactList])

  const renderContent = () => {
    if (longPosts === null) {
      return <SkeletonLongPosts />
    }
    if (!longPosts || !longPosts.length) {
      return <EmptyListMessage onReload={handleReloadLongPosts} />
    }
    return longPosts.map((longPost, i) => (
      <ItemLongNote
        key={i}
        onClick={() => handleOpenLongPosts(longPost)}
        time={longPost.created_at}
        content={longPost.content}
        subtitle={longPost.title}
        pubkey={longPost.pubkey}
        author={longPost.author}
      />
    ))
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Long posts
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={225}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
