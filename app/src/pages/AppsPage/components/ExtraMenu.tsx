import { FC } from 'react'
import { ListItemIcon, ListItemText, MenuItem, MenuProps } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { StyledMenu } from './styled'
import { useSearchParams } from 'react-router-dom'

type ExtraMenuProps = Omit<MenuProps, 'onClose'> & {
  handleClose: () => void
}

export const ExtraMenu: FC<ExtraMenuProps> = ({ anchorEl, handleClose, open }) => {
  const { handleOpen } = useOpenModalSearchParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleAddApp = () => {
    handleClose()
    handleOpen(MODAL_PARAMS_KEYS.FIND_APP)
  }

  const handleSwapMode = () => {
    handleClose()
    searchParams.set('mode', 'swap')
    setSearchParams(searchParams)
  }

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={handleAddApp}>
        <ListItemIcon color="inherit">
          <AddCircleOutlineIcon color="inherit" />
        </ListItemIcon>
        <ListItemText>Add new app</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleSwapMode}>
        <ListItemIcon color="inherit">
          <SwapHorizIcon color="inherit" />
        </ListItemIcon>
        <ListItemText>Change icons order</ListItemText>
      </MenuItem>
    </StyledMenu>
  )
}
