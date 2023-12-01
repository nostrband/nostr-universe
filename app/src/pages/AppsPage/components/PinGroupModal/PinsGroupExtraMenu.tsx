import { FC } from 'react'
import { ListItemIcon, ListItemText, MenuItem, MenuProps } from '@mui/material'
import { StyledMenu } from '../styled'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'

type PinsGroupExtraMenuProps = Omit<MenuProps, 'onClose'> & {
  handleClose: () => void
  onRenameClick: () => void
}

export const PinsGroupExtraMenu: FC<PinsGroupExtraMenuProps> = ({ anchorEl, handleClose, open, onRenameClick }) => {
  const handleRenameGroup = () => {
    onRenameClick()
    handleClose()
  }

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={handleRenameGroup}>
        <ListItemIcon color="inherit">
          <DriveFileRenameOutlineIcon color="inherit" />
        </ListItemIcon>
        <ListItemText>Rename folder</ListItemText>
      </MenuItem>
    </StyledMenu>
  )
}
