import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { IStyledPinApps } from './types'

export const StyledPinApps = styled(
  forwardRef<HTMLAnchorElement, IStyledPinApps>(function PinAppsDisplayName(props, ref) {
    return <Box ref={ref} {...props} />
  })
)(({ theme, drawerbleeding }) => ({
  backgroundColor: theme.palette.secondary.dark,
  position: 'absolute',
  top: -drawerbleeding,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  visibility: 'visible',
  right: 0,
  left: 0,
  paddingTop: 25,
  height: drawerbleeding,
  width: '100%'
}))

export const Puller = styled(Box)(({ theme }) => ({
  width: 64,
  height: 4,
  background: theme.palette.secondary.main,
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 0,
  right: 0,
  margin: 'auto'
}))

export const StyledSwipeableDrawerContent = styled(Box)(({ theme }) => ({
  height: '100%',
  overflow: 'auto',
  paddingBottom: 10,
  backgroundColor: theme.palette.secondary.dark
}))
