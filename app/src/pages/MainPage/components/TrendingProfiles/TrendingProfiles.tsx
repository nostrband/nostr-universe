import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { userService } from '@/store/services/user.service'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { memo, useCallback, FC, CSSProperties, useEffect } from 'react'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { Profile } from '@/shared/Profile/Profile'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { MetaEvent } from '@/types/meta-event'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useAppDispatch } from '@/store/hooks/redux'
import { setTrendingProfiles } from '@/store/reducers/contentWorkspace'

export const TrendingProfiles = memo(function TrendingProfiles() {
  const dispatch = useAppDispatch()
  const {
    data,
    isFetching: isLoading,
    refetch: refetchTrendingProfiles
  } = userService.useFetchTrendingProfilesQuery('')
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()

  const handleOpenProfile = useCallback(
    (event: MetaEvent) => {
      handleOpenContextMenu({ event })
    },

    [handleOpenContextMenu]
  )

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'trendingProfiles'
      }
    })
  }

  useEffect(() => {
    dispatch(setTrendingProfiles({ trendingProfiles: data }))
  }, [data])

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <HorizontalSwipeContent childrenWidth={140}>
          <SkeletonProfiles />
        </HorizontalSwipeContent>
      )
    }

    if (!data || !data.length) {
      const handleReloadTrendingProfiles = () => refetchTrendingProfiles()
      return <EmptyListMessage onReload={handleReloadTrendingProfiles} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const profile = data[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={data.length}>
          <Profile onClick={handleOpenProfile} profile={profile} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return <HorizontalSwipeVirtualContent itemHeight={170} itemSize={140} itemCount={data.length} RowComponent={Row} />
  }, [isLoading, data, refetchTrendingProfiles, handleOpenProfile])

  const isVisible = Boolean(data && data.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Profiles
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
