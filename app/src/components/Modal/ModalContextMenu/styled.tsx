import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import {
  Typography,
  TypographyProps,
  ListItemText,
  Avatar,
  InputBase,
  Box,
  ListItemAvatar,
  IconButton
} from '@mui/material'

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

export const StyledItemIconAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.secondary.dark,
  color: theme.palette.light.light
}))

export const StyledItemIconButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.secondary.dark,
  color: theme.palette.light.light,
  marginRight: '4px'
}))

export const StyledListItemAppIcon = styled(ListItemAvatar)(() => ({
  paddingLeft: '4px'
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

export const StyledMenuWrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  overflow: 'hidden',
  marginTop: '1rem'
}))

export const StyledItemEventPreview = styled(Box)(() => ({
  marginBottom: '1rem'
}))
