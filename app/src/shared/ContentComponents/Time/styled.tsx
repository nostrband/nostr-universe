import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { TypographyProps, Typography } from '@mui/material'

export const StyledTime = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function AppNameDisplayName(props, ref) {
    return <Typography variant="caption" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.light.light
}))
