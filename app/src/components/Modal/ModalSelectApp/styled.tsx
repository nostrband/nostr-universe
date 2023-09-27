import { styled } from '@mui/material/styles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'

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
