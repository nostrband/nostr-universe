import { useState } from 'react'
import { List, ListItemButton, ListItemAvatar, Avatar, ListItem, ListItemText } from '@mui/material'
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import {
  StyledViewAction,
  StyledViewAvatar,
  StyledViewAvatarSwitch,
  StyledViewAvatarWrapper,
  StyledViewBaner,
  StyledViewModal,
  StyledViewName
} from './styled'
import { Container } from '../../../../layout/Container/Conatiner'

export const ProfileView = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <Container>
        <StyledViewBaner>
          <StyledViewAvatarWrapper onClick={handleOpen}>
            <StyledViewAvatar src="https://i.pravatar.cc/150?img=3" />
            <StyledViewAvatarSwitch>
              <SyncAltOutlinedIcon fontSize="small" />
            </StyledViewAvatarSwitch>
          </StyledViewAvatarWrapper>
        </StyledViewBaner>
        <StyledViewName variant="h5" component="div">
          ALex test
        </StyledViewName>
        <StyledViewAction disableElevation color="secondary" variant="contained" size="large">
          Edit
        </StyledViewAction>
      </Container>

      <StyledViewModal onClose={handleClose} open={open} fullWidth maxWidth="lg">
        <List>
          <ListItem secondaryAction={<CheckCircleOutlinedIcon htmlColor="#48ff91" />} disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar src="https://i.pravatar.cc/150?img=3"></Avatar>
              </ListItemAvatar>
              <ListItemText primary="ALex test" />
            </ListItemButton>
          </ListItem>
        </List>
      </StyledViewModal>
    </>
  )
}
