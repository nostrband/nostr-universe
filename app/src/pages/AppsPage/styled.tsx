import { styled } from '@mui/material/styles'
import { AppBar, Dialog, Box } from '@mui/material'

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  position: 'relative',
  marginBottom: 10,
  borderBottom: '1px solid',
  borderColor: theme.palette.secondary.main
}))

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '.MuiDialog-paper': {
    backgroundColor: theme.palette.background.default
  }
}))

export const StyledWrap = styled(Box)(() => ({
  paddingBottom: 80,
  paddingTop: 60
}))

export const StyledSwipeableDrawerContent = styled(Box)(() => ({
  height: '100%',
  overflow: 'auto',
  paddingBottom: 10
}))
