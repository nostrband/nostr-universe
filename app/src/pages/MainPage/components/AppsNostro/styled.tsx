import { styled } from '@mui/material/styles'
import { Typography, TypographyProps } from '@mui/material'
import { forwardRef } from 'react'

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.textSecondaryDecorate.main,
  fontWeight: 'bold'
}))
