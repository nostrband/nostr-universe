import { Container } from '@/layout/Container/Conatiner'
import { TrendingProfile } from '@/types/trending-profiles'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { nostrbandRelay } from '@/modules/nostr'
import { SliderContacts } from '@/components/Slider/SliderContacts/SliderContacts'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'

export const ContactList = () => {
  const { handleOpen } = useOpenModalSearchParams(MODAL_PARAMS_KEYS.SELECT_APP)
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenProfile = (profile: TrendingProfile) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: profile.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpen({ key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: nprofile })
  }

  const getData = () => {
    if (contactList) {
      const data = contactList.contactEvents.map(({ profile }) => {
        return profile
      })

      return data
    }

    return []
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Contacts
        </StyledTitle>
      </Container>

      <SliderContacts data={getData()} isLoading={false} handleClickEntity={handleOpenProfile} />
    </StyledWrapper>
  )
}
