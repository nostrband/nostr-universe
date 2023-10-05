import { ListItemButton, ListItemAvatar } from '@mui/material'
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
// import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
// import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { StyledListItemIcon, StyledListItemText, StyledMenuList, StyledMenuWrapper } from './styled'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalPermissions } from '@/components/Modal/ModalPermissions/ModalPermissions'
import { useOpenApp } from '@/hooks/open-entity'

export const ProfilMenu = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { signEvent } = useOpenApp()

  const testSignEvent = async () => {

    const event = {
      kind: 1,
      created_at: Math.round(Date.now() / 1000),
      content: "Test",
      tags: [],
    }

    const e = await signEvent(event)
    console.log("signed", e)
  }

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
            <ListItemButton onClick={() => testSignEvent()}>
              <ListItemAvatar>
                <StyledListItemIcon>
                  <ChecklistOutlinedIcon />
                </StyledListItemIcon>
              </ListItemAvatar>
              <StyledListItemText primary="Test sign event" />
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
