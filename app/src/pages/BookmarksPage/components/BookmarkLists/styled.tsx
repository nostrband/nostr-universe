import { styled } from '@mui/material/styles'
import { Box, Typography, TypographyProps } from '@mui/material'
import { forwardRef } from 'react'
import { yellow } from '@mui/material/colors'

const color = yellow[100]

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)({
  color: color,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export const StyledWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}))
