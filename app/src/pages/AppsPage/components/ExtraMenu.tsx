import { FC } from 'react'
import { ListItemIcon, ListItemText, MenuItem, MenuProps } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { StyledMenu } from './styled'

type ExtraMenuProps = Omit<MenuProps, 'onClose'> & {
  handleClose: () => void
}

export const ExtraMenu: FC<ExtraMenuProps> = ({ anchorEl, handleClose, open }) => {
  const { handleOpen } = useOpenModalSearchParams()

  const handleAddApp = () => {
    handleClose()
    handleOpen(MODAL_PARAMS_KEYS.FIND_APP)
  }

  const handleAddGroup = () => {
    handleClose()
    handleOpen(MODAL_PARAMS_KEYS.PIN_GROUP_MODAL, {
      search: {
        groupName: 'DEFAULT_GROUPNAME'
      }
    })
  }

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={handleAddApp}>
        <ListItemIcon color="inherit">
          <AddCircleOutlineIcon color="inherit" />
        </ListItemIcon>
        <ListItemText>Add new app</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleAddGroup}>
        <ListItemIcon color="inherit">
          <AppRegistrationIcon color="inherit" />
        </ListItemIcon>
        <ListItemText>Add new group</ListItemText>
      </MenuItem>
    </StyledMenu>
  )
}
