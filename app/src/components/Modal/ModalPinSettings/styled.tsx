import { Input } from '@/shared/Input/Input'
import { Avatar, AvatarProps, Box, InputBaseProps, ListItemText, styled } from '@mui/material'

export const StyledItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold',
  flex: 'none'
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledItemIconAvatar = styled(({ danger, ...props }: AvatarProps & { danger?: boolean }) => (
  <Avatar {...props} />
))(({ theme, danger }) => ({
  background: danger ? '#a91b0d' : theme.palette.secondary.dark,
  color: theme.palette.light.light
}))

export const StyledMenuWrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  overflow: 'hidden',
  marginTop: '1rem'
}))

export const StyledForm = styled('div')(() => ({
  marginBottom: 15,
  marginTop: 8,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}))

export const StyledInput = styled((props: InputBaseProps) => (
  <Input classes={{ readOnly: 'read_only', focused: 'focused' }} {...props} />
))(({ theme }) => ({
  border: '1px solid transparent',
  transition: 'border 0.2s ease-in-out',
  '&:not(.read_only)': {
    border: '1px solid ' + theme.palette.text.primary
  }
}))
