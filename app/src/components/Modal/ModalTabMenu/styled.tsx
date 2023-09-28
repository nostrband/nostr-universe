import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps, ListItemText, Avatar, Box } from '@mui/material'

export const StyledInfoItem = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="body1" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  marginBottom: 5
}))

export const StyledItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold',
  flex: 'none'
}))

export const StyledItemIconAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.secondary.dark,
  color: theme.palette.light.light
}))

export const StyledWrapInput = styled(Box)(() => ({
  padding: '10px 0 15px 0'
}))

export const StyledMenuWrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  overflow: 'hidden'
}))
