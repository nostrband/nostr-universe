import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedCommunities, getTagValue, nostrbandRelay } from '@/modules/nostr'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { CommunityEvent } from '@/types/communities'
import { setCommunities } from '@/store/reducers/contentWorkspace'
import { memo, useCallback } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonCommunities } from '@/components/Skeleton/SkeletonCommunties/SkeletonCommunities'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemCommunity } from '@/components/ItemsContent/ItemCommunity/ItemCommunity'

export const Communities = memo(function Communities() {
  const { communities, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpen } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenCommuniti = useCallback(
    (note: CommunityEvent) => {
      const naddr = nip19.naddrEncode({
        pubkey: note.pubkey,
        kind: note.kind,
        identifier: getTagValue(note, 'd'),
        relays: [nostrbandRelay]
      })

      handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
        search: {
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: naddr,
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(note.kind)
        }
      })
    },
    [handleOpen]
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
      return <SkeletonCommunities />
    }
    if (!communities || !communities.length) {
      return <EmptyListMessage onReload={handleReloadCommunities} />
    }
    return communities.map((community, i) => (
      <ItemCommunity
        key={i}
        onClick={() => handleOpenCommuniti(community)}
        time={community.last_post_tm}
        content={community.description}
        subtitle={`+${community.posts} posts`}
        name={`/${community.name}`}
        picture={community.image}
      />
    ))
  }, [communities, handleReloadCommunities, handleOpenCommuniti])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Active communities
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={225}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
