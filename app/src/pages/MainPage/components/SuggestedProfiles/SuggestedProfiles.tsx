import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { userService } from '@/store/services/user.service'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { memo, useCallback, FC, CSSProperties, useEffect } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { Profile } from '@/shared/Profile/Profile'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { MetaEvent } from '@/types/meta-event'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { setSuggestedProfiles } from '@/store/reducers/contentWorkspace'

export const SuggestedProfiles = memo(function SuggestedProfiles() {
  const dispatch = useAppDispatch()
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const {
    data,
    isFetching: isLoading,
    refetch: refetchSuggestedProfiles
  } = userService.useFetchSuggestedProfilesQuery(currentPubkey, {
    skip: !currentPubkey
  })

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
        keyData: 'suggestedProfiles'
      }
    })
  }

  useEffect(() => {
    dispatch(setSuggestedProfiles({ suggestedProfiles: data }))
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
      const handleReloadSuggestedProfiles = () => refetchSuggestedProfiles()
      return <EmptyListMessage onReload={handleReloadSuggestedProfiles} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const profile = data[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={data.length}>
          <Profile onClick={handleOpenProfile} profile={profile} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return <HorizontalSwipeVirtualContent itemHeight={164} itemSize={140} itemCount={data.length} RowComponent={Row} />
  }, [isLoading, data, handleOpenProfile, refetchSuggestedProfiles])

  const isVisible = Boolean(data && data.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Suggested profiles
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
