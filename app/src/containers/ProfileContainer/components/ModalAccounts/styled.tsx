import { styled } from '@mui/material/styles'
import { Dialog, ListItemText, ListItemButton, Avatar } from '@mui/material'

export const StyledViewModal = styled(Dialog)(() => ({
  '.MuiDialog-paper': {
    margin: 0,
    width: 'calc(100% - 30px)',
    background: '#3D3D3D'
  }
}))

export const StyledItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold',
  flex: 'none'
}))

export const StyledItemButton = styled(ListItemButton)(() => ({
  justifyContent: 'center'
}))

export const StyledItemIconAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.decorate.main,
  color: theme.palette.light.light
}))
