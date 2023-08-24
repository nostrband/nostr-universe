import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const StyledWrapper = styled(Box)(() => ({
  position: 'fixed',
  left: 0,
  bottom: 0,
  height: 50,
  width: '100%',
  background: '#000',
  zIndex: 1
}))
