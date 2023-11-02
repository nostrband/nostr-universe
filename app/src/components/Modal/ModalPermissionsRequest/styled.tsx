import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, IconButton, TypographyProps, Box, SwitchProps, Switch, FormControlLabel } from '@mui/material'

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 100
}))

export const StyledLabel = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
}))

export const StyledInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: 10,
  marginBottom: 10,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  padding: 15
}))

export const StyledButtonContainer = styled(Box)(() => ({
  display: 'flex',
  gap: 10
}))

export const StyledField = styled(Box)(() => ({
  marginBottom: 10
}))

export const StyledInputButton = styled(IconButton)(() => ({
  marginBottom: 'auto'
}))

export const StyledFormControl = styled(FormControlLabel)(() => ({
  margin: 0,
  marginBottom: 10
}))

export const SwitchControl = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.decorate.main,
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.secondary.main,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

export const StyledPermInfoUser = styled(Box)(() => ({
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  justifyContent: 'center'
}))
