import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay, subscribeContactList } from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { Profile } from '@/shared/Profile/Profile'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { SkeletonContactList } from '@/components/Skeleton/SkeletonContactList/SkeletonContactList'
import { selectKeys } from '@/store/store'
import { setContactList } from '@/store/reducers/contentWorkspace'
import { ContactListEvent } from '@/types/contact-list-event'

export const ContactList = memo(function ContactList() {
  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { currentPubkey } = useAppSelector(selectKeys)
  const dispatch = useAppDispatch()

  const handleOpenProfile = useCallback(
    (pubkey: string) => {
      const nprofile = nip19.nprofileEncode({
        pubkey: pubkey,
        relays: [nostrbandRelay]
      })

      handleOpenContextMenu({ bech32: nprofile })
    },
    [handleOpenContextMenu]
  )

  const handleReloadContactList = () => {
    dispatch(setContactList({ contactList: null }))

    subscribeContactList(currentPubkey, async (contactList: ContactListEvent) => {
      if (contactList) {
        dispatch(setContactList({ contactList }))
      }
    })
  }

  const renderContent = () => {
    if (contactList === null) {
      return (
        <HorizontalSwipeContent childrenWidth={115}>
          <SkeletonContactList />
        </HorizontalSwipeContent>
      )
    }
    if (!contactList || !contactList?.contactEvents.length) {
      return <EmptyListMessage onReload={handleReloadContactList} />
    }

    const RowContact: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const profile = contactList.contactEvents[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={contactList.contactEvents.length}>
          <Profile isContact onClick={handleOpenProfile} profile={profile} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent
        itemHight={114}
        itemSize={115}
        itemCount={contactList?.contactEvents.length}
        RowComponent={RowContact}
      />
    )
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Following
        </StyledTitle>
      </Container>

      {renderContent()}
    </StyledWrapper>
  )
})
