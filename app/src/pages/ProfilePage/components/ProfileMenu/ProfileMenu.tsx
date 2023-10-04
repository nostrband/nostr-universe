import { ListItemButton, ListItemAvatar } from '@mui/material'
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
// import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import TocOutlinedIcon from '@mui/icons-material/TocOutlined'
// import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { StyledListItemIcon, StyledListItemText, StyledMenuList, StyledMenuWrapper } from './styled'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalPermissions } from '@/components/Modal/ModalPermissions/ModalPermissions'

export const ProfilMenu = () => {
  const { handleOpen } = useOpenModalSearchParams()

  return (
    <>
      <Container>
        <StyledMenuWrapper>
          {/* <StyledMenuTitle variant="body1" component="div">
            Tools
          </StyledMenuTitle> */}
          <StyledMenuList>
            <ListItemButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_MODAL, { append: true })}>
              <ListItemAvatar>
                <StyledListItemIcon>
                  <ChecklistOutlinedIcon />
                </StyledListItemIcon>
              </ListItemAvatar>
              <StyledListItemText primary="Key permissions" />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleOpen(MODAL_PARAMS_KEYS.CONTENT_FEEDS_SETTINGS_MODAL, { append: true })}
            >
              <ListItemAvatar>
                <StyledListItemIcon>
                  <TocOutlinedIcon />
                </StyledListItemIcon>
              </ListItemAvatar>
              <StyledListItemText primary="Content feeds" />
            </ListItemButton>
            {/* <ListItemButton>
            <ListItemAvatar>
              <StyledListItemIcon>
                <StoreOutlinedIcon />
              </StyledListItemIcon>
            </ListItemAvatar>
            <StyledListItemText primary="Key vault" />
          </ListItemButton>
          <ListItemButton>
            <ListItemAvatar>
              <StyledListItemIcon>
                <PeopleAltOutlinedIcon />
              </StyledListItemIcon>
            </ListItemAvatar>
            <StyledListItemText primary="Contacts" />
          </ListItemButton>
          <ListItemButton>
            <ListItemAvatar>
              <StyledListItemIcon>
                <AccountBalanceWalletOutlinedIcon />
              </StyledListItemIcon>
            </ListItemAvatar>
            <StyledListItemText primary="Wallet Connect" />
          </ListItemButton> */}
          </StyledMenuList>
        </StyledMenuWrapper>
        <ModalPermissions />
      </Container>
    </>
  )
}
