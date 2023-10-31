import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Avatar, Typography, IconButton, TypographyProps } from '@mui/material'

export const StyledProfile = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '15px 5px 5px 5px',
  // minWidth: 140,
  width: '100%',
  overflow: 'hidden',
  background: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius,
  gap: 10,
  boxSizing: 'border-box'
}))

export const StyledProfileAvatar = styled(Avatar)(() => ({
  height: 50,
  width: 50
}))

export const StyledProfileName = styled(Typography)(({ theme }) => ({
  color: theme.palette.light.contrastText,
  fontWeight: 'bold',
  textWrap: 'nowrap',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center'
}))

export const StyledAboutProfile = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.primary,
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical'
}))

export const StyledProfileAction = styled(IconButton)(({ theme }) => ({
  background: theme.palette.decorate.main,
  color: theme.palette.decorate.contrastText,
  '&:hover': {
    color: theme.palette.decorate.main
  }
}))
