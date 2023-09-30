import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Avatar, Typography, TypographyProps, Button, BoxProps } from '@mui/material'

export const StyledViewBaner = styled((props: BoxProps & { url: string }) => <Box {...props} />)(({ theme, url }) => ({
  position: 'relative',
  height: 100,
  background: url
    ? `url(${url})`
    : 'linear-gradient(45deg, rgba(238,59,255,1) 0%, rgba(121,9,95,1) 35%, rgba(117,0,255,1) 100%)',
  borderRadius: theme.shape.borderRadius,
  backgroundSize: 'cover',
  marginBottom: 50
}))

export const StyledViewAvatar = styled(Avatar)(({ theme }) => ({
  border: '3px solid',
  height: 70,
  width: 70,
  borderColor: theme.palette.light.light
}))

export const StyledViewAvatarWrapper = styled(Box)(() => ({
  position: 'absolute',
  bottom: -35,
  left: 0,
  right: 0,
  margin: 'auto',
  zIndex: 1,
  height: 70,
  width: 70
}))

export const StyledViewAvatarSwitch = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: -5,
  right: -5,
  zIndex: 1,
  height: 30,
  width: 30,
  borderRadius: '50%',
  background: theme.palette.decorate.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.background.default
}))

export const StyledViewName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 10,
  color: theme.palette.light.light
}))

export const StyledViewAction = styled(Button)(() => ({
  textTransform: 'capitalize',
  borderRadius: 50,
  minWidth: 100,
  margin: 'auto',
  display: 'flex',
  marginBottom: 20
}))
