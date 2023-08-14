import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { IBoxStyled, INameStyled } from './types'
import { getFontSizeAppNostro, getGutterNameAppNostro, getSizeAppNostro } from './helpers'

export const StyledApp = styled(
  forwardRef<HTMLAnchorElement, IBoxStyled>(function BoxDisplayName(props, ref) {
    return <Box ref={ref} {...props} />
  })
)(({ theme, size }) => ({
  position: 'relative',
  border: '4px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  ...getSizeAppNostro(size),
  transition: theme.transitions.create(['border-color', 'transition']),
  ':hover': {
    borderColor: 'rgba(255, 255, 255, 0.3)'
  }
}))

export const StyledAppImg = styled('img')(() => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}))

export const StyledAppWraper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}))

export const StyledAppName = styled(
  forwardRef<HTMLAnchorElement, INameStyled>(function AppNameDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme, size }) => ({
  color: theme.palette.light.light,
  fontSize: getFontSizeAppNostro(size),
  marginTop: getGutterNameAppNostro(size)
}))
