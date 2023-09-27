import { styled } from '@mui/material/styles'
import { InputBase } from '@mui/material'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'

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

export const StyledForm = styled('div')(() => ({
  marginBottom: 15,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}))

export const StyledNoAppsMessage = styled(EmptyListMessage)({
  justifyContent: 'center',
  fontSize: '1rem'
})
