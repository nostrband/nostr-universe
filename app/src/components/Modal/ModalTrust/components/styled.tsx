import { Avatar, Box, Typography, styled } from '@mui/material'

export const StyledProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  width: '100%',
  overflow: 'hidden',
  background: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius,
  gap: 10,
  boxSizing: 'border-box'
}))

export const StyledProfileAvatar = styled(Avatar)(() => ({
  height: 50,
  width: 50
}))

export const StyledProfileName = styled(Typography)(({ theme }) => ({
  color: theme.palette.light.contrastText,
  fontWeight: 'bold',
  textWrap: 'nowrap',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}))

export const StyledScore = styled(Typography)(({ theme }) => ({
  color: theme.palette.light.contrastText,
  fontWeight: 'bold',
  textWrap: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '18px'
}))
