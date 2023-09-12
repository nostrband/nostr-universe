import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { AppBar, Dialog, Box, TypographyProps, Typography } from '@mui/material'

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
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 5,
  height: '100%',
  width: '100%'
}))

export const StyledAppPreview = styled(Box)(() => ({
  position: 'relative',
  display: 'block',
  height: 70,
  width: 70,
  overflow: 'hidden'
}))

export const StyledAppImg = styled('img')(() => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}))

export const StyledViewName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: 10,
  color: theme.palette.light.light
}))
