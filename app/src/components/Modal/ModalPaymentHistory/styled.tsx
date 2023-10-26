import { forwardRef } from 'react'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { styled } from '@mui/material/styles'
import { Box, Typography, TypographyProps } from '@mui/material'

export const StyledItemBlock = styled(Box)(() => ({
  marginBottom: 10
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

export const StyledWrapperAmount = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%'
}))

export const StyledViewTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="h6" component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.light.light
}))

export const StyledViewText = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="body1" component="div" ref={ref} {...props} />
  })
)(({ }) => ({
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflowX: 'hidden'
}))

export const StyledFilterField = styled(Box)(() => ({
  marginBottom: 10,
  '&:first-type': {
    marginTop: 20
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
    color: '#fff'
  },
  gap: '0.5rem',
  '.MuiFormLabel-root, .Mui-focused': {
    color: '#fff'
  },
  '.MuiAutocomplete-endAdornment': {
    '.MuiButtonBase-root': {
      color: '#fff'
    }
  },
  '.MuiInputBase-input': {
    color: '#fff'
  }
}))

export const StyledPaymentAmountActions = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end'
}))

export const StyledPaymentAmount = styled(Box)(() => ({
  display: 'flex',
  gap: 10
}))
