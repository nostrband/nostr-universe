import { styled } from '@mui/material/styles'
import { Box, Typography, TypographyProps } from '@mui/material'
import { forwardRef } from 'react'

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.textSecondaryDecorate.main,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

export const StyledWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}))
