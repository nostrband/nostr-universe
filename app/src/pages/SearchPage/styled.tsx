import { Box, Dialog, styled, InputBase } from '@mui/material'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '.MuiDialog-paper': {
    backgroundColor: theme.palette.background.default
  }
}))

export const StyledWrap = styled(Box)(() => ({
  paddingBottom: 80,
  paddingTop: 60,
  maxHeight: '100%',
  overflowY: 'auto'
}))

export const StyledInput = styled(InputBase)(({ theme }) => ({
  background: theme.palette.secondary.main,
  width: '100%',
  minHeight: 50,
  borderRadius: theme.shape.borderRadius,
  color: '#fff',
  fontSize: 14,
  padding: '4px 16px',
  '&:placeholder': {
    color: '#C9C9C9'
  },
  gap: '0.5rem'
}))

export const StyledForm = styled('form')(() => ({
  marginBottom: 15
}))
