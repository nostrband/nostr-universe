import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { Avatar, List, ListItemAvatar, ListItemText } from '@mui/material'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { useSearchParams } from 'react-router-dom'
import {
  StyledViewAvatar,
  StyledViewAvatarWrapper,
  StyledViewBaner,
  StyledViewTitle,
  StyledViewName,
  StyledListItem
} from './styled'
import { getRenderedUsername } from '@/utils/helpers/general'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { IPerm } from '@/types/permission-req'

export const ModalProfileTabMenu = () => {
  const [searchParams] = useSearchParams()
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PROFILE_TAB_MENU_MODAL)
  const id = searchParams.get('tabId') || ''

  const { currentProfile } = useAppSelector((state) => state.profile)
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const currentWorkSpace = workspaces.find((workspace) => workspace.pubkey === currentPubKey)
  const currentTab = currentWorkSpace?.tabs.find((tab) => tab.id === id)

  const perms = currentTab
    ? (currentWorkSpace?.perms.filter((perm) => perm.app === getTabGroupId(currentTab)) as IPerm[])
    : []

  return (
    <Modal title="Profile" open={isOpen} handleClose={() => handleClose()}>
      <Container>
        <StyledViewBaner>
          <StyledViewAvatarWrapper>
            <StyledViewAvatar src={getProfileImage(currentProfile)} />
          </StyledViewAvatarWrapper>
        </StyledViewBaner>
        <StyledViewName>{getRenderedUsername(currentProfile, currentPubKey)}</StyledViewName>

        <StyledViewTitle>Tab</StyledViewTitle>
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
            <ListItemAvatar>
              <Avatar>
                <InsertLinkOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={currentTab?.url} />
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
                  <ListItemText primary={perm.name} />
                </StyledListItem>
              ))}
            </>
          )}
        </List>
      </Container>
    </Modal>
  )
}
