import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, Button, TypographyProps, Alert, ListItemText, ListItemButton, Avatar, List } from '@mui/material'

export const StyledInfoItem = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
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
  '.MuiListItemText-secondary': {
    color: theme.palette.grey[500]
  }
}))

export const StyledItemButton = styled(ListItemButton)(() => ({
  borderTop: '1px solid',
  paddingLeft: 0,
  paddingRight: 0
}))

export const StyledItemIconAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.secondary.main,
  color: theme.palette.light.light
}))

export const StyledList = styled(List)(() => ({
  padding: 0
}))

export const StyledAlert = styled(Alert)(() => ({
  marginBottom: 15
}))

export const StyledAaddButton = styled(Button)(() => ({
  marginTop: 15
}))
