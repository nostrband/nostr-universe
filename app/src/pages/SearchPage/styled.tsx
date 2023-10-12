import { forwardRef } from 'react'
import { styled, InputBase, Typography, TypographyProps, Box, IconButton } from '@mui/material'
import { purple } from '@mui/material/colors'

export const StyledForm = styled('form')(() => ({
  marginBottom: 15
}))

export const StyledInput = styled(InputBase)(({ theme }) => ({
  background: theme.palette.secondary.main,
  width: '100%',
  minHeight: 50,
  borderRadius: theme.shape.borderRadius,
  color: '#fff',
  fontSize: 14,
  padding: '4px 16px',
  '&:placeholder': {
    color: '#C9C9C9'
  },
  gap: '0.5rem'
}))

const color = purple[100]

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(() => ({
  color: color,
  fontWeight: 'bold'
}))

export const StyledWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}))

export const StyledRecentQueryWrap = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius,
  minHeight: '3rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  paddingRight: '2rem'
}))

export const StyledCloseTabBtn = styled(IconButton)(({ theme }) => ({
  background: 'rgba(34, 34, 34, 0.58)',
  color: theme.palette.light.light,
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 1
}))

export const StyledSearchTermValue = styled((props: TypographyProps) => {
  return <Typography {...props} variant="body1" />
})(({ theme }) => ({
  width: '100%',
  fontSize: '1rem',
  fontWeight: '600',
  color: theme.palette.light.light,
  lineHeight: '18px',
  textAlign: 'left',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'nowrap'
}))
