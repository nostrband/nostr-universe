import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { INameStyled } from './types'
import { APP_NAME_FONT_SIZE_VALUE, APP_NAME_GUTTER_VALUE } from './const'
import { APP_NOSTRO_SIZE } from '@/consts'

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
