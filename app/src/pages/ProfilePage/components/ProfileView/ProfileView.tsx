import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useChangeAccount } from '@/hooks/workspaces'
import { getNpub, getProfileImage, isGuest } from '@/utils/helpers/prepare-data'
import { ModalAccounts } from '../ModalAccounts/ModalAccounts'
import {
  StyledViewAvatar,
  StyledViewAvatarSwitch,
  StyledViewAvatarWrapper,
  StyledViewBaner,
  StyledViewKey,
  StyledViewName
} from './styled'
import { getRenderedUsername, getShortenText } from '@/utils/helpers/general'
import { createMetaEvent } from '@/types/meta-event'
import { createAugmentedEvent, createEvent } from '@/types/augmented-event'
import { userService } from '@/store/services/user.service'
import { useProfileImageSource } from '@/hooks/profile-image'

export const ProfileView = () => {
  const { getModalOpened, handleOpen, handleClose } = useOpenModalSearchParams()
  const { currentProfile, profiles } = useAppSelector((state) => state.profile)
  const { keys, currentPubkey: currentPubKey } = useAppSelector((state) => state.keys)
  const { changeAccount } = useChangeAccount()

  const { url, viewRef } = useProfileImageSource({
    pubkey: currentProfile?.pubkey || '',
    mediaType: 'banner',
    size: 600,
    originalImage: currentProfile?.profile?.banner || ''
  })

  const accounts = keys.map((key) => {
    let p = profiles.find((p) => p.pubkey === key)
    if (!p) p = createMetaEvent(createAugmentedEvent(createEvent({ pubkey: key })))
    return p
  })

  const [fetchTrendingNotes] = userService.useLazyFetchTrendingNotesQuery()
  const [fetchTrendingProfiles] = userService.useLazyFetchTrendingProfilesQuery()

  const handlechangeAccount = (pubkey: string) => {
    fetchTrendingNotes('')
    fetchTrendingProfiles('')
    changeAccount(pubkey)
    handleClose()
  }

  const handleCloseProfile = () => {
    handleClose()
  }

  const getCurrentPubKey = isGuest(currentPubKey) ? '' : currentPubKey

  const isOpenModalAccounts = getModalOpened(MODAL_PARAMS_KEYS.KEYS_PROFILE)

  const name = getRenderedUsername(currentProfile, currentPubKey)

  const key = isGuest(currentPubKey) ? '' : getShortenText(getNpub(currentPubKey))

  return (
    <>
      <Container>
        <StyledViewBaner url={url}>
          <StyledViewAvatarWrapper
            ref={viewRef}
            onClick={() => handleOpen(MODAL_PARAMS_KEYS.KEYS_PROFILE, { append: true })}
          >
            <StyledViewAvatar src={getProfileImage(currentProfile)} />
            <StyledViewAvatarSwitch>
              <SyncAltOutlinedIcon fontSize="small" />
            </StyledViewAvatarSwitch>
          </StyledViewAvatarWrapper>
        </StyledViewBaner>
        <StyledViewName variant="h5" component="div">
          {name}
        </StyledViewName>
        <StyledViewKey variant="h6" component="div">
          {key != name && key}
        </StyledViewKey>
        {/* <StyledViewAction
          // onClick={handleOpenKeyImport}
          disableElevation
          color="secondary"
          variant="contained"
          size="large"
        >
          LATER
        </StyledViewAction> */}
      </Container>

      <ModalAccounts
        changeAccount={handlechangeAccount}
        currentPubKey={getCurrentPubKey}
        handleClose={handleCloseProfile}
        open={isOpenModalAccounts}
        accounts={accounts}
      />
    </>
  )
}
