import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { AppBar, Dialog, Box, TypographyProps, Typography, IconButton } from '@mui/material'

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

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="body1" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold'
}))

export const StyledHeadTabGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: theme.spacing(1)
}))

export const StyledTabWrap = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius
}))

export const StyledCloseTabBtn = styled(IconButton)(({ theme }) => ({
  background: 'rgba(34, 34, 34, 0.58)',
  color: theme.palette.light.light,
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 1
}))
