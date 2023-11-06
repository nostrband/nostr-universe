import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { TypographyProps, Typography } from '@mui/material'

export const StyledKindView = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function AppNameDisplayName(props, ref) {
    return <Typography variant="body2" component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.light.light,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  fontSize: '0.7em'
}))
