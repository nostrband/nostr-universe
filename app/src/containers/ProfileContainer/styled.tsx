import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const StyledWrapper = styled(Box)(() => ({
  position: 'fixed',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  background: '#000',
  zIndex: 2
}))
