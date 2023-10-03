import { styled } from '@mui/material/styles'
import { AppBar, Dialog, Box, Grid, GridProps, IconButton } from '@mui/material'

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

export const StyledSwipeableDrawerContent = styled(Box)(() => ({
  height: '100%',
  overflow: 'auto',
  padding: '10px 0'
}))

export const StyledAddButtonWrapper = styled((props: GridProps) => {
  return <Grid {...props} xs={2} />
})({
  display: 'grid',
  placeItems: 'center',
  minHeight: '60px'
})

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.decorate.main,
  color: theme.palette.light.light,
  '&:is(:hover, :active)': {
    background: theme.palette.decorate.main
  }
}))
