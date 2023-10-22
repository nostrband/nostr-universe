import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useChangeAccount } from '@/hooks/workspaces'
import { copyToClipBoard, getNpub, getProfileImage, isGuest } from '@/utils/helpers/prepare-data'
import {
  CurrentProfileWrapper,
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
import { IconButton, Stack } from '@mui/material'
import { Input } from '@/shared/Input/Input'
import { ItemProfile } from '../ItemProfile/ItemProfile'

export const ProfileView = () => {
  const { handleClose, handleOpen } = useOpenModalSearchParams()
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
    handleClose()
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
      <StyledViewBaner url={url}></StyledViewBaner>

      <Stack flexDirection={'row'} gap={'0.5rem'} alignItems={'center'} ref={viewRef}>
        <CurrentProfileWrapper>
          <StyledViewAvatar src={getProfileImage(currentProfile)} />
          <StyledViewName variant="h5" component="div">
            {name}
          </StyledViewName>
        </CurrentProfileWrapper>

        {!!accounts.length && (
          <SuggestedProfilesWrapper>
            {accounts.map((account) => {
              return (
                <ItemProfile
                  {...account}
                  onChangeAccount={() => handlechangeAccount(account.pubkey)}
                  key={account.pubkey}
                />
              )
            })}
          </SuggestedProfilesWrapper>
        )}

        <StyledAddButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.ADD_KEY_MODAL, { replace: true })} />
      </Stack>

      <StyledViewKey component="div">{type}</StyledViewKey>
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
