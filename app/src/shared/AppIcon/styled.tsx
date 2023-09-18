import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Avatar } from '@mui/material'
import { IAvatarProps, IBoxStyled } from './types'
import { APP_NAME_FONT_SIZE_VALUE, APP_NOSTRO_SIZE_VALUE } from './const'
import { APP_NOSTRO_SIZE } from '@/consts'
import { AppNostroSize } from '@/types/app-nostro'
import { purple } from '@mui/material/colors'

const color = purple[500]

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

export const StyledAppIcon = styled(
  forwardRef<HTMLAnchorElement, IBoxStyled>(function BoxDisplayName(props, ref) {
    const exclude = new Set(['isActive', 'isPreviewTab', 'isOutline', 'isNotLoaded'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Box ref={ref} {...omitProps} />
  })
)(
  ({
    theme,
    size = APP_NOSTRO_SIZE.MEDIUM,
    isActive = false,
    isPreviewTab = false,
    isOutline = true,
    isNotLoaded = false
  }) => ({
    position: 'relative',
    border: isOutline ? '4px solid' : 0,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    ...getVariantApp(isPreviewTab, size),
    transition: theme.transitions.create(['border-color', 'transition']),
    borderColor: isActive ? theme.palette.decorate.main : 'rgba(255, 255, 255, 0.1)',
    backgroundColor: isNotLoaded ? color : theme.palette.background.default,
    boxSizing: 'border-box',
    ':active': {
      borderColor: 'rgba(255, 255, 255, 0.3)'
    }
  })
)

export const StyledAppImg = styled(
  forwardRef<HTMLAnchorElement, IAvatarProps>(function BoxDisplayName(props) {
    // return <Avatar  {...props} />
    const exclude = new Set(['isPreviewTab'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Avatar variant="square" {...omitProps} />
  })
)(({ theme, isPreviewTab = false, size = APP_NOSTRO_SIZE.MEDIUM }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  background: 'none',
  color: theme.palette.light.light,
  fontWeight: 'bold',
  fontSize: isPreviewTab ? APP_NAME_FONT_SIZE_VALUE[APP_NOSTRO_SIZE.EXTRA_SMALL] : APP_NAME_FONT_SIZE_VALUE[size]
}))
