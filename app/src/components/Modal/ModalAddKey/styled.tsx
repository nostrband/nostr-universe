import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps, ListItem, ListItemText, List, ListItemButton, Avatar } from '@mui/material'

export const StyledViewTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="h6" component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.light.light
}))

export const StyledListItem = styled(ListItem)(() => ({
  marginBottom: 10
}))

export const StyledList = styled(List)(() => ({
  marginBottom: 10
}))

export const StyledItemButton = styled(ListItemButton)(({ theme }) => ({
  borderBottom: '1px solid',
  padding: '10px 0',
  borderColor: theme.palette.secondary.light
}))

export const StyledItemIconAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.decorate.main,
  color: theme.palette.light.light
}))

export const StyledItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold',
  flex: 'none'
}))
