import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { IconButton, Box } from '@mui/material'
import { IIconButton } from './types'

export const StyledIconButton = styled(
  forwardRef<HTMLButtonElement, IIconButton>(function TypographyDisplayName(props, ref) {
    return <IconButton ref={ref} {...props} />
  })
)(() => ({
  padding: 0
}))

export const StyledWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 2,
  background: theme.palette.background.default
}))
