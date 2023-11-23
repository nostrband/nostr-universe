import { Container } from '@/layout/Container/Conatiner'
import { userService } from '@/store/services/user.service'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledTitle, StyledWrapper } from './styled'
import { AuthoredEvent } from '@/types/authored-event'
import { memo, useCallback, FC, CSSProperties, useEffect } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { ItemTrendingNote } from '@/components/ItemsContent/ItemTrendingNote/ItemTrendingNote'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { SkeletonTrendingNotes } from '@/components/Skeleton/SkeletonTrendingNotes/SkeletonTrendingNotes'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useAppDispatch } from '@/store/hooks/redux'
import { setTrendingNotes } from '@/store/reducers/contentWorkspace'

export const TrendingNotes = memo(function TrendingNotes() {
  const dispatch = useAppDispatch()
  const { data, isFetching: isLoading, refetch: refetchTrendingNotes } = userService.useFetchTrendingNotesQuery('')
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()

  const handleOpenNote = useCallback(
    (event: AuthoredEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'trendingNotes'
      }
    })
  }

  useEffect(() => {
    dispatch(setTrendingNotes({ trendingNotes: data }))
  }, [data])

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

    return <HorizontalSwipeVirtualContent itemHeight={113} itemSize={225} itemCount={data.length} RowComponent={Row} />
  }, [isLoading, refetchTrendingNotes, handleOpenNote, data])

  const isVisible = Boolean(data && data.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Notes
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
