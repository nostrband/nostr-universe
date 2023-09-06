import { ListItemButton, ListItemAvatar } from '@mui/material'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { StyledListItemIcon, StyledListItemText, StyledMenuList, StyledMenuTitle, StyledMenuWrapper } from './styled'

export const ProfilMenu = () => {
  return (
    <Container>
      <StyledMenuWrapper>
        <StyledMenuTitle variant="body1" component="div">
          Tools
        </StyledMenuTitle>
        <StyledMenuList>
          <ListItemButton>
            <ListItemAvatar>
              <StyledListItemIcon>
                <SettingsOutlinedIcon />
              </StyledListItemIcon>
            </ListItemAvatar>
            <StyledListItemText primary="Settings" />
          </ListItemButton>
          <ListItemButton>
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
          </ListItemButton>
        </StyledMenuList>
      </StyledMenuWrapper>
    </Container>
  )
}
