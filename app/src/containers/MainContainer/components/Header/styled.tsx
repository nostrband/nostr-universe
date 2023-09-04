import { styled } from '@mui/material/styles'
import { IconButton, Box } from '@mui/material'

export const StyledIconButton = styled(IconButton)(() => ({
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
