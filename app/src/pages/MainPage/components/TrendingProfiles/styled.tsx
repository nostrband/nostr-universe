import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps, Box } from '@mui/material'

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.textPrimaryDecorate.main,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

export const StyledWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}))
