import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, BoxProps } from '@mui/material'

interface IBox {
  isShow: boolean
}

export type IBoxStyled = IBox & BoxProps

export const StyledWrapVisibility = styled(
  forwardRef<HTMLAnchorElement, IBoxStyled>(function BoxDisplayName(props, ref) {
    const exclude = new Set(['isShow'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Box ref={ref} {...omitProps} />
  })
)(({ theme, isShow = false }) => ({
  position: 'fixed',
  height: '100%',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: 1,
  paddingTop: 60,
  paddingBottom: 80,
  visibility: isShow ? 'visible' : 'hidden',
  background: theme.palette.background.default,
  overflowY: 'scroll'
}))
