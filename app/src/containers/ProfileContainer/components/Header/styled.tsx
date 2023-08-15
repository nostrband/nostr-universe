import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps } from '@mui/material'

export const StyledProfileTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold'
}))
