import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedHighlights, nostrbandRelay } from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { HighlightEvent } from '@/types/highlight-event'
import { setHighlights } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { ItemHighlight } from '@/components/ItemsContent/ItemHighlight/ItemHighlight'
import { SkeletonHighlights } from '@/components/Skeleton/SkeletonHighlights/SkeletonHighlights'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'

export const Highlights = memo(function Highlights() {
  const { handleOpen } = useOpenModalSearchParams()
  const { highlights, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const dispatch = useAppDispatch()

  const handleOpenHighlight = useCallback(
    (highlight: HighlightEvent) => {
      const nevent = nip19.neventEncode({
        id: highlight.id,
        relays: [nostrbandRelay]
      })

      handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
        search: {
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nevent,
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(highlight.kind)
        }
      })
    },
    [handleOpen]
  )

  const handleReloadHighlights = useCallback(async () => {
    if (contactList) {
      dispatch(setHighlights({ highlights: null }))
      const highlights = await fetchFollowedHighlights(contactList.contactPubkeys).catch(() => {
        dispatch(setHighlights({ highlights: null }))
      })
      dispatch(setHighlights({ highlights }))
    }
  }, [dispatch, contactList])

  const renderContent = useCallback(() => {
    if (highlights === null) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonHighlights />
        </HorizontalSwipeContent>
      )
    }

    if (!highlights || !highlights.length) {
      return <EmptyListMessage onReload={handleReloadHighlights} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const highlight = highlights[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={highlights.length}>
          <ItemHighlight
            onClick={() => handleOpenHighlight(highlight)}
            time={highlight.created_at}
            content={highlight.content}
            pubkey={highlight.pubkey}
            author={highlight.author}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent itemHight={113} itemSize={225} itemCount={highlights.length} RowComponent={Row} />
    )
  }, [highlights, handleReloadHighlights, handleOpenHighlight])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Highlights
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
