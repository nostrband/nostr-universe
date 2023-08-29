import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { AppNostroSize, IBoxStyled, INameStyled } from './types'
import { APP_NAME_FONT_SIZE_VALUE, APP_NAME_GUTTER_VALUE, APP_NOSTRO_SIZE, APP_NOSTRO_SIZE_VALUE } from './const'

const getVariantApp = (isPreviewTab: boolean, size: AppNostroSize) => {
  if (isPreviewTab) {
    return {
      height: 34,
      width: 34,
      borderRadius: '50%'
    }
  }

  return APP_NOSTRO_SIZE_VALUE[size]
}

export const StyledApp = styled(
  forwardRef<HTMLAnchorElement, IBoxStyled>(function BoxDisplayName(props, ref) {
    const exclude = new Set(['isActive', 'isPreviewTab'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Box ref={ref} {...omitProps} />
  })
)(({ theme, size = APP_NOSTRO_SIZE.MEDIUM, isActive = false, isPreviewTab = false }) => ({
  position: 'relative',
  border: '4px solid',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  ...getVariantApp(isPreviewTab, size),
  transition: theme.transitions.create(['border-color', 'transition']),
  borderColor: isActive ? theme.palette.decorate.main : 'rgba(255, 255, 255, 0.1)',
  boxSizing: 'border-box',
  ':active': {
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
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center'
}))

export const StyledAppName = styled(
  forwardRef<HTMLAnchorElement, INameStyled>(function AppNameDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme, size = APP_NOSTRO_SIZE.MEDIUM }) => ({
  color: theme.palette.light.light,
  fontSize: APP_NAME_FONT_SIZE_VALUE[size],
  marginTop: APP_NAME_GUTTER_VALUE[size]
}))
