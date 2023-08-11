import { styled } from '@mui/material/styles'
import { Box, Avatar, Typography, IconButton } from '@mui/material'

export const StyledProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '15px 20px',
  minWidth: 100,
  background: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius
}))

export const StyledProfileAvatar = styled(Avatar)(() => ({
  height: 50,
  width: 50,
  marginBottom: 10
}))

export const StyledProfileName = styled(Typography)(({ theme }) => ({
  color: theme.palette.light.contrastText,
  fontWeight: 'bold',
  marginBottom: 10
}))

export const StyledProfileAction = styled(IconButton)(({ theme }) => ({
  background: theme.palette.decorate.main,
  color: theme.palette.decorate.contrastText,
  '&:hover': {
    color: theme.palette.decorate.main
  }
}))
