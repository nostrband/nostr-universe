import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { CommunityEvent } from '@/types/communities'
import { selectCommunities } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonCommunities } from '@/components/Skeleton/SkeletonCommunties/SkeletonCommunities'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemCommunity } from '@/components/ItemsContent/ItemCommunity/ItemCommunity'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useFeeds } from '@/hooks/feeds'

export const Communities = memo(function Communities() {
  const communities = useAppSelector(selectCommunities)
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const { reloadCommunities } = useFeeds()

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'communities'
      }
    })
  }

  const handleOpenCommuniti = useCallback(
    (event: CommunityEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (communities === null) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonCommunities />
        </HorizontalSwipeContent>
      )
    }
    if (!communities || !communities.length) {
      return <EmptyListMessage onReload={reloadCommunities} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const community = communities[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={communities.length}>
          <ItemCommunity
            onClick={() => handleOpenCommuniti(community)}
            time={community.last_post_tm}
            content={community.description}
            subtitle={`+${community.posts} posts`}
            name={`/${community.name}`}
            picture={community.image}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent
        itemHeight={141}
        itemSize={225}
        itemCount={communities.length}
        RowComponent={Row}
      />
    )
  }, [communities, reloadCommunities, handleOpenCommuniti])

  const isVisible = Boolean(communities && communities.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Active communities
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
