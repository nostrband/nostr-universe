import { styled } from '@mui/material/styles'
import { AppBar, Dialog } from '@mui/material'

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  marginBottom: 10,
  borderBottom: '1px solid',
  borderColor: theme.palette.secondary.main
}))

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '.MuiDialog-paper': {
    paddingTop: 65,
    backgroundColor: theme.palette.background.default
  }
}))
