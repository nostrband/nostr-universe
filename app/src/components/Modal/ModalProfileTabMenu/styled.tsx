import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Avatar, Typography, TypographyProps, ListItem } from '@mui/material'

export const StyledViewBaner = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 100,
  background: 'linear-gradient(45deg, rgba(238,59,255,1) 0%, rgba(121,9,95,1) 35%, rgba(117,0,255,1) 100%)',
  borderRadius: theme.shape.borderRadius,
  marginBottom: 50
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

export const StyledViewAvatar = styled(Avatar)(({ theme }) => ({
  border: '3px solid',
  height: 70,
  width: 70,
  borderColor: theme.palette.light.light
}))

export const StyledViewName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="h5" component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center',
  color: theme.palette.light.light
}))

export const StyledViewTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="h6" component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: 15,
  color: theme.palette.light.light
}))

export const StyledListItem = styled(ListItem)(() => ({
  marginBottom: 10
}))
