import { styled } from '@mui/material/styles'
import { Typography, TypographyProps, Box, IconButton, IconButtonProps } from '@mui/material'
import { forwardRef } from 'react'
import CloseIcon from '@mui/icons-material/Close'

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="body1" component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  marginBottom: 10
}))

export const StyledActions = styled(Box)(() => ({
  display: 'flex',
  gap: 20
}))

export const StyledContainer = styled(Box)(() => ({
  marginBottom: 20
}))

export const StyledTitleWrapper = styled(Box)(() => ({
  position: 'relative'
}))

export const StyledDeleteButton = styled((props: IconButtonProps) => (
  <IconButton {...props} size="small" edge="start" color="inherit" aria-label="close">
    <CloseIcon />
  </IconButton>
))(({ theme }) => ({
  padding: 0,
  background: 'rgba(34, 34, 34, 0.58)',
  color: theme.palette.light.light,
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 1
}))
