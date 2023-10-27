import { forwardRef } from 'react'
import {
  styled,
  Typography,
  TypographyProps,
  Box,
  IconButton,
  TextField,
  Popper,
  autocompleteClasses
} from '@mui/material'
import { purple } from '@mui/material/colors'
import { darken } from '@mui/system'

export const StyledForm = styled('form')(() => ({
  marginBottom: 15,
  position: 'relative'
}))

export const StyledInputBox = styled('div')(({ theme }) => ({
  width: '100%',
  minHeight: 56,
  background: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius,
  fontSize: 14,
  padding: '4px 16px 4px 14px',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: '0.5px',
  '& .suggestion_block': {
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100% - 1rem - 80px)',
    overflow: 'auto'
  },
  '& .hidden_part': {
    opacity: 0,
    height: 'fit-content',
    pointerEvents: 'none'
  },
  '& .suggestion_value': {
    background: theme.palette.secondary.light,
    color: '#fff',
    height: 'fit-content',
    display: 'inline-block'
  }
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
  background: 'none',
  width: '100%',
  minHeight: 56,
  borderRadius: theme.shape.borderRadius,
  '&:placeholder': {
    color: '#C9C9C9'
  },
  '& .MuiInputBase-root': {
    fontSize: 14,
    letterSpacing: '0.5px',
    color: '#fff',
    padding: '8px 9px'
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
  },
  '.MuiOutlinedInput-root': {
    paddingRight: '9px !important'
  }
}))

export const StyledAutocomplete = styled(Box)(() => ({
  position: 'relative',
  width: '100%'
}))

export const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: darken(theme.palette.secondary.contrastText, 0.8),
  zIndex: 1
}))

export const GroupItems = styled('ul')({
  padding: 0
})

export const StyledPopper = styled(Popper)(({ theme }) => ({
  width: '100%',
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    background: theme.palette.secondary.main,
    maxHeight: 'calc(100vh - 180px)',
    '& ul': {
      padding: 0,
      margin: 0,
      background: theme.palette.secondary.main,
      '& li:hover': {
        background: darken(theme.palette.secondary.contrastText, 0.5),
        color: theme.palette.primary.contrastText
      },
      '.MuiAutocomplete-option[aria-selected="true"].Mui-focused, .MuiAutocomplete-option[aria-selected="true"]': {
        background: darken(theme.palette.secondary.contrastText, 0.6),
        color: theme.palette.primary.contrastText
      }
    }
  }
}))

export const StyledOptionText = styled(Box)(() => ({
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: 10
}))
