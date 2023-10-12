import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { MetaEvent } from '@/types/meta-event'
import { memo, useCallback } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { Profile } from '@/shared/Profile/Profile'

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

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Contacts
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={115}>
        {contactList?.contactEvents.map((profile, i) => (
          <Profile key={i} isContact onClick={handleOpenProfile} profile={profile} />
        ))}
      </HorizontalSwipeContent>
    </StyledWrapper>
  )
})
