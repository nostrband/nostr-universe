import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IconButton, IconButtonProps, Typography, TypographyProps, styled } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { forwardRef } from 'react'

export const StyledQueryTimeInfo = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} variant="caption" />
  })
)(({ theme }) => ({
  textAlign: 'right',
  color: theme.palette.light.light,
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  marginTop: 'auto'
}))

export const StyledWrapper = styled(Wrapper)({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '1.5rem',
  paddingBottom: '0.5rem',
  position: 'relative'
})

export const StyledDeleteButton = styled((props: IconButtonProps) => (
  <IconButton {...props} size="small" edge="start" color="inherit" aria-label="close">
    <CloseIcon />
  </IconButton>
))(({ theme }) => ({
  background: 'rgba(34, 34, 34, 0.58)',
  color: theme.palette.light.light,
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 1
}))
