import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, BoxProps, TypographyProps, Typography } from '@mui/material'

export interface IBoxStyled extends BoxProps {
  isNotRounded?: boolean
}

export const StyledPicture = styled(
  forwardRef<HTMLAnchorElement, IBoxStyled>(function BoxDisplayName(props, ref) {
    const exclude = new Set(['isNotRounded'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Box ref={ref} {...omitProps} />
  })
)(({ isNotRounded = false }) => ({
  position: 'relative',
  height: 32,
  width: 32,
  overflow: 'hidden',
  borderRadius: isNotRounded ? 4 : '50%',
  flexShrink: 0
}))

export const StyledImg = styled('img')(() => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}))

export const StyledProfileInfo = styled(Box)(() => ({
  display: 'flex',
  gap: 10,
  alignItems: 'center'
}))

export const StyledName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function AppNameDisplayName(props, ref) {
    return <Typography variant="body2" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold'
}))
