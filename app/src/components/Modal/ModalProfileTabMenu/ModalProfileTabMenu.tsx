import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { Avatar, List, ListItemAvatar, ListItemText } from '@mui/material'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { useSearchParams } from 'react-router-dom'
import { StyledViewTitle, StyledListItem } from './styled'
import { getRenderedUsername } from '@/utils/helpers/general'
import { getOrigin, getProfileImage } from '@/utils/helpers/prepare-data'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { IPerm } from '@/types/permission-req'
import { selectTab } from '@/store/reducers/tab.slice'

export const ModalProfileTabMenu = () => {
  const [searchParams] = useSearchParams()
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PROFILE_TAB_MENU_MODAL)
  const id = searchParams.get('tabId') || ''

  const { currentProfile } = useAppSelector((state) => state.profile)
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const currentWorkSpace = workspaces.find((workspace) => workspace.pubkey === currentPubkey)
  const currentTab = useAppSelector((state) => selectTab(state, id))

  const perms = currentTab
    ? (currentWorkSpace?.perms.filter((perm) => perm.app === getTabGroupId(currentTab)) as IPerm[])
    : []

  const prepareLabel = (perm: string) => {
    if (perm === 'pubkey') {
      return 'Read your public key'
    } else if (perm?.startsWith('pay_invoice:')) {
      const wallet = perm?.split(':')[1]
      return `Payment from wallet '${wallet}'`
    } else if (perm?.startsWith('sign:')) {
      const kind = perm?.split(':')[1]
      return 'Sign event of kind ' + kind + ':'
    } else if (perm === 'encrypt') {
      return 'Encrypt a message:'
    } else if (perm === 'decrypt') {
      return 'Decrypt a message:'
    }
  }

  return (
    <Modal title="App permissions" open={isOpen} handleClose={() => handleClose()}>
      <Container>
        <StyledViewTitle>Account</StyledViewTitle>
        <List dense>
          <StyledListItem disablePadding>
            <ListItemAvatar>
              <Avatar src={getProfileImage(currentProfile)}>
                <ImageOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={getRenderedUsername(currentProfile, currentPubkey)} />
          </StyledListItem>
        </List>

        <StyledViewTitle>App</StyledViewTitle>
        <List dense>
          <StyledListItem disablePadding>
            <ListItemAvatar>
              <Avatar src={currentTab?.icon}>
                <ImageOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={currentTab?.title} />
          </StyledListItem>
          <StyledListItem disablePadding>
            <ListItemText primary={"Address: " + getOrigin(currentTab?.url || '')} />
          </StyledListItem>
        </List>

        <StyledViewTitle>Permissions</StyledViewTitle>
        <List dense>
          {!perms.length ? (
            <StyledListItem disablePadding>
              <ListItemText primary="No permissions given yet." />
            </StyledListItem>
          ) : (
            <>
              {perms.map((perm, i) => (
                <StyledListItem key={i} disablePadding>
                  <ListItemText primary={prepareLabel(perm.name)} />
                </StyledListItem>
              ))}
            </>
          )}
        </List>
      </Container>
    </Modal>
  )
}
