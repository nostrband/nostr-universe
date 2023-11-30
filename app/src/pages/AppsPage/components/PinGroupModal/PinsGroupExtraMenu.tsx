import { FC } from 'react'
import { ListItemIcon, ListItemText, MenuItem, MenuProps } from '@mui/material'
import { StyledMenu } from '../styled'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'

type PinsGroupExtraMenuProps = Omit<MenuProps, 'onClose'> & {
  handleClose: () => void
  onRenameClick: () => void
  onRemoveClick: () => void
}

export const PinsGroupExtraMenu: FC<PinsGroupExtraMenuProps> = ({
  anchorEl,
  handleClose,
  open,
  onRenameClick,
  onRemoveClick
}) => {
  const handleRenameGroup = () => {
    onRenameClick()
    handleClose()
  }

  const handleRemoveFromGroup = () => {
    onRemoveClick()
    handleClose()
  }

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={handleRenameGroup}>
        <ListItemIcon color="inherit">
          <DriveFileRenameOutlineIcon color="inherit" />
        </ListItemIcon>
        <ListItemText>Change group name</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleRemoveFromGroup}>
        <ListItemIcon color="inherit">
          <RestoreFromTrashIcon color="inherit" />
        </ListItemIcon>
        <ListItemText>Remove from group</ListItemText>
      </MenuItem>
    </StyledMenu>
  )
}
