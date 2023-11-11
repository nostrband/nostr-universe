import { styled } from '@mui/material/styles'
import { Typography, TypographyProps, Box } from '@mui/material'
import { forwardRef } from 'react'

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="body1" component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}))

export const StyledText = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="body2" component="div" ref={ref} {...props} />
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
