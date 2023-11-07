import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { fetchFollowedLongNotes } from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { LongNoteEvent } from '@/types/long-note-event'
import { setLongPosts } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonLongPosts } from '@/components/Skeleton/SkeletonLongPosts/SkeletonLongPosts'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemLongNote } from '@/components/ItemsContent/ItemLongNote/ItemLongNote'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'

export const LongPosts = memo(function LongPosts() {
  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const { longPosts, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const dispatch = useAppDispatch()

  const handleOpenLongPosts = useCallback(
    (event: LongNoteEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
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

  const renderContent = useCallback(() => {
    if (longPosts === null) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonLongPosts />
        </HorizontalSwipeContent>
      )
    }
    if (!longPosts || !longPosts.length) {
      return <EmptyListMessage onReload={handleReloadLongPosts} />
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
  }, [longPosts, handleReloadLongPosts, handleOpenLongPosts])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Long posts
        </StyledTitle>
      </Container>

      {renderContent()}
    </StyledWrapper>
  )
})
