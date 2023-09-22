import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { SliderContacts } from '@/components/Slider/SliderContacts/SliderContacts'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { MetaEvent } from '@/types/meta-event'

export const ContactList = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenProfile = (profile: MetaEvent) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: profile.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nprofile } })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Contacts
        </StyledTitle>
      </Container>

      <SliderContacts data={contactList?.contactEvents || []} isLoading={false} handleClickEntity={handleOpenProfile} />
    </StyledWrapper>
  )
}
