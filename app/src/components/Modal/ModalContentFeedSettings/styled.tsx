import { ListItem, ListItemButton, Switch, SwitchProps, Typography, TypographyProps, styled } from '@mui/material'
import { forwardRef } from 'react'

export const StyledHint = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography variant="body2" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'normal',
  marginBottom: 5
}))

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  background: theme.palette.secondary.main,
  color: theme.palette.light.light,
  '&:not(:first-of-type)': {
    marginTop: '0.5rem'
  },
  borderRadius: theme.shape.borderRadius
}))

export const StyledListItemButton = styled(ListItemButton)(() => ({
  width: 'fit-content',
  maxWidth: 'fit-content'
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
    backgroundColor: theme.palette.secondary.dark,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))
