import { styled } from '@mui/material/styles'
import { IconButton, Box, Avatar, AvatarProps, Typography, TypographyProps } from '@mui/material'
import { AppLogo } from '@/assets'
import { Header } from '@/layout/Header/Header'

export const StyledIconButton = styled(IconButton)(() => ({
  padding: 0
}))

export const StyledContainerButton = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  flexDirection: 'row-reverse',
  flex: 1
}))

export const StyledWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 2,
  background: theme.palette.background.default
}))

export const StyledAppLogo = styled((props: AvatarProps) => {
  return <Avatar {...props} src={AppLogo} />
})({
  width: 32,
  height: 32,
  backgroundColor: '#ccc'
})

export const StyledHeader = styled(Header)({
  gap: '0.5rem'
})

export const StyledPageTitle = styled((props: TypographyProps) => {
  return <Typography {...props} variant="h1" />
})(({ theme }) => ({
  fontSize: '1.3rem',
  fontWeight: '600',
  color: theme.palette.light.light,
  lineHeight: '18px',
  marginBottom: '-3px'
}))
