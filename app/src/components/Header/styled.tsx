import { styled } from '@mui/material/styles'
import { IconButton, Box } from '@mui/material'

export const StyledButton = styled(IconButton)(() => ({
  padding: 0
}))

export const StyledHeader = styled(Box)(() => ({
  padding: 15,
  display: 'flex',
  justifyContent: 'space-between'
}))
