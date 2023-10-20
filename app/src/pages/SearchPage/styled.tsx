import { forwardRef } from 'react'
import { styled, Typography, TypographyProps, Box, IconButton, TextField } from '@mui/material'
import { purple } from '@mui/material/colors'
import { lighten, darken } from '@mui/system'

export const StyledForm = styled('form')(() => ({
  marginBottom: 15
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

export const StyledAutocompleteInput = styled(TextField)(({ theme }) => ({
  background: theme.palette.secondary.main,
  width: '100%',
  minHeight: 50,
  borderRadius: theme.shape.borderRadius,
  color: '#fff',
  fontSize: 14,
  '&:placeholder': {
    color: '#C9C9C9'
  },
  gap: '0.5rem',
  '.MuiFormLabel-root, .Mui-focused, .MuiAutocomplete-input, .MuiChip-label': {
    color: '#fff'
  },
  '.MuiSvgIcon-root': {
    fill: 'rgba(255, 255, 255, 0.5)'
  },
  '.MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}))

export const StyledAutocomplete = styled(Box)(() => ({
  display: 'flex',
  gap: 10,
  width: '100%'
}))

export const StyledAutocompleteButton = styled(Box)(({ theme }) => ({
  background: theme.palette.secondary.main,
  minWidth: 56,
  minHeight: 50,
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  color: '#fff',
  '& > *': {
    margin: 'auto'
  }
}))

export const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8)
}))

export const GroupItems = styled('ul')({
  padding: 0
})
