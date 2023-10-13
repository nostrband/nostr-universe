import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { MetaEvent } from '@/types/meta-event'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { Profile } from '@/shared/Profile/Profile'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'

export const ContactList = memo(function ContactList() {
  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenProfile = useCallback(
    (profile: MetaEvent) => {
      const nprofile = nip19.nprofileEncode({
        pubkey: profile.pubkey,
        relays: [nostrbandRelay]
      })

      handleOpenContextMenu({ bech32: nprofile })
    },
    [handleOpenContextMenu]
  )

  const RowContact: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
    if (contactList === null) {
      return null
    }

    const profile = contactList.contactEvents[index]

    return (
      <HorizontalSwipeVirtualItem style={style} index={index} itemCount={contactList.contactEvents.length}>
        <Profile isContact onClick={handleOpenProfile} profile={profile} />
      </HorizontalSwipeVirtualItem>
    )
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Following
        </StyledTitle>
      </Container>

      {contactList && (
        <HorizontalSwipeVirtualContent
          itemHight={114}
          itemSize={115}
          itemCount={contactList?.contactEvents.length}
          RowComponent={RowContact}
        />
      )}
    </StyledWrapper>
  )
})
