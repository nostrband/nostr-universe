import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const StyledItemVitual = styled(Box)(() => ({
  paddingRight: 4,
  paddingLeft: 4,
  '&:last-of-type': {
    paddingRight: 16
  },

  '& > *': {
    height: '100%'
  }
}))
