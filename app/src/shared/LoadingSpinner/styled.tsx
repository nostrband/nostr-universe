import { Box, CircularProgress, styled } from '@mui/material'

export const StyledCircularProgress = styled(CircularProgress)({
  color: '#fff'
})

export const StyledLoadingContainer = styled(Box)({
  display: 'grid',
  placeItems: 'center',
  height: '100%',
  margin: 'auto'
})
