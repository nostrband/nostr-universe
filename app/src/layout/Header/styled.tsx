import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const StyledHeader = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))
