import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useChangeAccount } from '@/hooks/workspaces'
import { getNpub, getProfileImage, getProfileName, isGuest } from '@/utils/helpers/prepare-data'
import { ModalAccounts } from '../ModalAccounts/ModalAccounts'
import {
  StyledViewAction,
  StyledViewAvatar,
  StyledViewAvatarSwitch,
  StyledViewAvatarWrapper,
  StyledViewBaner,
  StyledViewName
} from './styled'
import { ModalImportKey } from '@/components/Modal/ModaImporKey/ModalImportKey'

export const ProfileView = () => {
  const { open, handleOpen, handleClose } = useOpenModalSearchParams(MODAL_PARAMS_KEYS.KEYS_PROFILE)
  const { currentProfile, profiles } = useAppSelector((state) => state.profile)
  const { keys, currentPubKey } = useAppSelector((state) => state.keys)
  const { changeAccount } = useChangeAccount()

  const accounts = keys.map((key) => {
    return {
      pubkey: key,
      ...profiles.find((profile) => {
        if (profile.pubkey === key) {
          return profile
        }
      })
    }
  })

  const handlechangeAccount = (pubkey: string) => {
    changeAccount(pubkey)
    handleClose()
  }

  const getCurrentPubKey = isGuest(currentPubKey) ? '' : getNpub(currentPubKey)

  return (
    <>
      <Container>
        <StyledViewBaner>
          <StyledViewAvatarWrapper onClick={() => handleOpen()}>
            <StyledViewAvatar src={getProfileImage(currentProfile)} />
            <StyledViewAvatarSwitch>
              <SyncAltOutlinedIcon fontSize="small" />
            </StyledViewAvatarSwitch>
          </StyledViewAvatarWrapper>
        </StyledViewBaner>
        <StyledViewName variant="h5" component="div">
          {getProfileName(currentProfile)}
        </StyledViewName>
        <StyledViewAction
          // onClick={handleOpenKeyImport}
          disableElevation
          color="secondary"
          variant="contained"
          size="large"
        >
          Edit
        </StyledViewAction>
      </Container>

      <ModalAccounts
        changeAccount={handlechangeAccount}
        currentPubKey={getCurrentPubKey}
        handleClose={handleClose}
        open={open}
        accounts={accounts}
      />

      <ModalImportKey />
    </>
  )
}
