import { styled } from '@mui/material/styles'
import { Typography, TypographyProps, Box } from '@mui/material'
import { forwardRef } from 'react'

import { blue } from '@mui/material/colors'

const color = blue[100]

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="h5" gutterBottom component="div" ref={ref} {...props} />
  })
)(() => ({
  color: color,
  fontWeight: 'bold'
}))

export const StyledSubTitle = styled(
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
