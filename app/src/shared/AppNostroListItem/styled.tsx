import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Typography, TypographyProps } from '@mui/material'

export const StyledApp = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.dark,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  display: 'flex',
  gap: 15,
  alignItems: 'center'
}))

export const StyledAppIcon = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  boxSizing: 'border-box',
  height: 60,
  maxWidth: 60,
  width: '100%',
  display: 'block',
  overflow: 'hidden'
}))

export const StyledAppWrap = styled(Box)(() => ({
  position: 'relative',
  height: 60,
  width: 60,
  display: 'inline-flex',
  flexShrink: 0
}))

export const StyledAppPinIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: -8,
  top: -5,
  zIndex: 1,
  color: theme.palette.light.light,
  transform: 'rotate(45deg)'
}))

export const StyledAppImg = styled('img')(() => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}))

export const StyledDetailsWrapper = styled(Box)({
  width: 'calc(100% - 75px)'
})

export const StyledAppName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function AppNameDisplayName(props, ref) {
    return <Typography variant="body1" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold'
}))

export const StyledAppAbout = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function AppNameDisplayName(props, ref) {
    return <Typography variant="body2" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  marginTop: 4
}))
