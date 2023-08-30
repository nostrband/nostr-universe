import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const StyledWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  overflow: 'hidden',
  width: '100%'
}))
