import { forwardRef } from 'react'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { styled } from '@mui/material/styles'
import {
  Box,
  TextField,
  Typography,
  TypographyProps,
  ListItem,
  ListItemText,
  ListItemButton,
  Avatar,
  Autocomplete
} from '@mui/material'

export const StyledViewTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="h6" component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.light.light
}))

export const StyledListItem = styled(ListItem)(() => ({
  borderBottom: '1px solid #fff',
  flexDirection: 'column',
  padding: 0
}))

export const StyledListItemActions = styled(ListItem)(() => ({
  gap: 10,
  padding: '10px 0'
}))

export const StyledFilterField = styled(Box)(() => ({
  marginBottom: 10,
  '&:first-type': {
    marginTop: 20
  }
}))

export const StyledWrapDialogContent = styled(Box)(() => ({
  padding: '15px'
}))

export const StyledItemButton = styled(ListItemButton)(({ theme }) => ({
  borderTop: '1px solid',
  padding: '10px 0',
  borderColor: theme.palette.secondary.light,
  width: '100%'
}))

export const StyledItemIconAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.decorate.main,
  color: theme.palette.light.light
}))

export const StyledItemText = styled(ListItemText)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  margin: 0,
  padding: '10px 0',
  borderBottom: '1px dashed #fff',
  justifyContent: 'space-between',
  color: theme.palette.light.light,
  fontWeight: 'bold',
  flex: 'none',
  '.MuiListItemText-secondary': {
    color: theme.palette.light.light
  },
  '&:last-child': {
    border: 'none'
  }
}))

export const StyledWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#3C3C3C',
  overflow: 'hidden',
  width: '100%',
  '&:not(:last-child)': {
    marginBottom: 10
  }
}))

export const StyledInputWrap = styled(Box)(() => ({
  paddingTop: 5,
  paddingBottom: 10
}))

export const StyledHead = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between'
}))

export const StyledInput = styled(TextField)(({ theme }) => ({
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
  '.MuiFormLabel-root, .Mui-focused': {
    color: '#fff'
  },
  '.MuiAutocomplete-endAdornment': {
    '.MuiButtonBase-root': {
      color: '#fff'
    }
  }
}))

export const StyledAutocomplete = styled(Autocomplete)(() => ({
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}))

export const StyledDatePicker = styled(MobileDatePicker)(({ theme }) => ({
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
  '.MuiFormLabel-root, .Mui-focused': {
    color: '#fff'
  },
  '.MuiAutocomplete-endAdornment': {
    '.MuiButtonBase-root': {
      color: '#fff'
    }
  }
}))
