import { styled } from '@mui/material/styles'
import { Box, IconButton, Avatar } from '@mui/material'
import { StyledContainer } from '@/layout/Container/styled'

export const StyledWrapper = styled(StyledContainer)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  bottom: 0,
  height: 50,
  width: '100%',
  background: theme.palette.background.default,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

export const StyledTabsActions = styled(Box)(() => ({
  display: 'flex',
  gap: 5
}))

export const StyledIconButton = styled(IconButton)(() => ({
  padding: 0
}))

export const StyledAvatar = styled(Avatar)(() => ({
  height: 34,
  width: 34
}))
