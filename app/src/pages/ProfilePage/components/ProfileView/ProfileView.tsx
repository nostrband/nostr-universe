import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useChangeAccount } from '@/hooks/workspaces'
import { copyToClipBoard, getNpub, getProfileImage, isGuest } from '@/utils/helpers/prepare-data'
import {
  CurrentProfileWrapper,
  ProfilesList,
  StyledAddButton,
  StyledForm,
  StyledViewAvatar,
  StyledViewBaner,
  StyledViewKey,
  StyledViewName,
  SuggestedProfilesWrapper
} from './styled'
import { getRenderedUsername } from '@/utils/helpers/general'
import { createMetaEvent } from '@/types/meta-event'
import { createAugmentedEvent, createEvent } from '@/types/augmented-event'
import { userService } from '@/store/services/user.service'
import { useProfileImageSource } from '@/hooks/profile-image'
import { IAccount } from '../ModalAccounts/types'
import { IconButton } from '@mui/material'
import { Input } from '@/shared/Input/Input'
import { ItemProfile } from '../ItemProfile/ItemProfile'

export const ProfileView = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { currentProfile, profiles } = useAppSelector((state) => state.profile)
  const { keys, currentPubkey, readKeys, nsbKeys } = useAppSelector((state) => state.keys)
  const { changeAccount } = useChangeAccount()

  const { url, viewRef } = useProfileImageSource({
    pubkey: currentProfile?.pubkey || '',
    mediaType: 'banner',
    size: 600,
    originalImage: currentProfile?.profile?.banner || ''
  })

  const accounts = keys
    .map((key) => {
      let p = profiles.find((p) => p.pubkey === key)
      if (!p) p = createMetaEvent(createAugmentedEvent(createEvent({ pubkey: key })))

      const acc: IAccount = {
        ...p,
        isReadOnly: readKeys.includes(key),
        isNsb: nsbKeys.includes(key)
      }

      return acc
    })
    .filter((acc) => acc.pubkey !== currentPubkey)

  const [fetchTrendingNotes] = userService.useLazyFetchTrendingNotesQuery()
  const [fetchTrendingProfiles] = userService.useLazyFetchTrendingProfilesQuery()

  const handlechangeAccount = (pubkey: string) => {
    fetchTrendingNotes('')
    fetchTrendingProfiles('')
    changeAccount(pubkey)
//    handleClose()
  }

  const name = getRenderedUsername(currentProfile, currentPubkey)
  const npub = isGuest(currentPubkey) ? '' : getNpub(currentPubkey)
  const type = readKeys.includes(currentPubkey)
    ? 'Read-only key'
    : nsbKeys.includes(currentPubkey)
    ? 'NsecBunker key'
    : ''

  return (
    <Container>
      <StyledViewBaner url={url}>
        <CurrentProfileWrapper>
          <StyledViewAvatar src={getProfileImage(currentProfile)} />
        </CurrentProfileWrapper>
        <SuggestedProfilesWrapper flexDirection={'row'} gap={'0.5rem'} alignItems={'center'}>
          {!!accounts.length && (
            <ProfilesList>
              {accounts.map((account) => {
                return (
                  <ItemProfile
                    {...account}
                    onChangeAccount={() => handlechangeAccount(account.pubkey)}
                    key={account.pubkey}
                  />
                )
              })}
            </ProfilesList>
          )}

          <StyledAddButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.ADD_KEY_MODAL, { replace: true })} />
        </SuggestedProfilesWrapper>
      </StyledViewBaner>

      <StyledViewName ref={viewRef} variant="h5" component="div">
        {name}
      </StyledViewName>
      {type && <StyledViewKey component="div">{type}</StyledViewKey>}
      {npub && (
        <StyledForm>
          <Input
            endAdornment={
              <IconButton color="inherit" size="medium" onClick={() => copyToClipBoard(npub)}>
                <ContentCopyIcon />
              </IconButton>
            }
            readOnly
            value={npub}
          />
        </StyledForm>
      )}

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
  )
}
