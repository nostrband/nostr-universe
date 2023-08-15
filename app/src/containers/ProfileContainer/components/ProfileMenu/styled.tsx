import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, List, Avatar, ListItemText, Typography, TypographyProps } from '@mui/material'

export const StyledMenuWrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  overflow: 'hidden'
}))

export const StyledMenuList = styled(List)(() => ({
  // padding: 0
}))

export const StyledMenuTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(() => ({
  padding: 16,
  paddingBottom: 0,
  fontWeight: 'bold'
}))

export const StyledListItemIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.light.light
}))

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold'
}))
