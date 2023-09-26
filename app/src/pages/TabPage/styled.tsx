import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Dialog, Box, TypographyProps, Typography } from '@mui/material'

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

export const StyledViewName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: 10,
  color: theme.palette.light.light
}))
