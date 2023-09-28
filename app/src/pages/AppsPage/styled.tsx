import { styled } from '@mui/material/styles'
import { Dialog, Box } from '@mui/material'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '.MuiDialog-paper': {
    backgroundColor: theme.palette.background.default
  }
}))

export const StyledSwipeableDrawerContent = styled(Box)(() => ({
  height: '100%',
  overflow: 'auto',
  paddingBottom: 10
}))
