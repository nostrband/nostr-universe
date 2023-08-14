import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const StyledContainer = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1)
}))
