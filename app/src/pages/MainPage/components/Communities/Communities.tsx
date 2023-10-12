import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedCommunities, getTagValue, nostrbandRelay } from '@/modules/nostr'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { CommunityEvent } from '@/types/communities'
import { setCommunities } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonCommunities } from '@/components/Skeleton/SkeletonCommunties/SkeletonCommunities'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemCommunity } from '@/components/ItemsContent/ItemCommunity/ItemCommunity'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'

export const Communities = memo(function Communities() {
  const { communities, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenCommuniti = useCallback(
    (note: CommunityEvent) => {
      const naddr = nip19.naddrEncode({
        pubkey: note.pubkey,
        kind: note.kind,
        identifier: getTagValue(note, 'd'),
        relays: [nostrbandRelay]
      })

      handleOpenContextMenu({ bech32: naddr })
    },
    [handleOpenContextMenu]
  )

  const handleReloadCommunities = useCallback(async () => {
    if (contactList) {
      dispatch(setCommunities({ communities: null }))
      const communities = await fetchFollowedCommunities(contactList.contactPubkeys).catch(() => {
        dispatch(setCommunities({ communities: null }))
      })
      dispatch(setCommunities({ communities }))
    }
  }, [dispatch, contactList])

  const renderContent = useCallback(() => {
    if (communities === null) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonCommunities />
        </HorizontalSwipeContent>
      )
    }
    if (!communities || !communities.length) {
      return <EmptyListMessage onReload={handleReloadCommunities} />
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
      <HorizontalSwipeVirtualContent itemHight={141} itemSize={225} itemCount={communities.length} RowComponent={Row} />
    )
  }, [communities, handleReloadCommunities, handleOpenCommuniti])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Active communities
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
