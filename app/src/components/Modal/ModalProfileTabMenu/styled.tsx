import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps, ListItem, ListItemText, List } from '@mui/material'

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

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.light.light,
  '.MuiTypography-body2': {
    fontWeight: '800'
  }
}))
