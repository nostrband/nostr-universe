import { Avatar, Box, InputBase, ListItemText, Typography, TypographyProps, styled } from '@mui/material'
import { forwardRef } from 'react'

export const StyledMenuWrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  overflow: 'hidden',
  marginTop: '1rem'
}))

export const StyledItemIconAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.secondary.dark,
  color: theme.palette.light.light
}))

export const StyledItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold',
  flex: 'none',
  width: '100%',
  '.MuiTypography-root': {
    display: 'block',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '70%'
  }
}))

export const StyledInput = styled(InputBase)(({ theme }) => ({
  background: theme.palette.secondary.main,
  width: '100%',
  minHeight: 50,
  borderRadius: theme.shape.borderRadius,
  color: '#fff',
  fontSize: 14,
  padding: '4px 16px',
  '&:placeholder': {
    color: '#C9C9C9'
  },
  gap: '0.5rem'
}))

export const StyledAppName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} variant="h5" />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  color: theme.palette.light.light,
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))

export const StyledAppDescription = styled(Box)(({ theme }) => ({
  color: theme.palette.light.light,
  width: '100%',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}))
