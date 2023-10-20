import { ToggleButtonGroup, ToggleButton, styled, ToggleButtonProps, ToggleButtonGroupProps } from '@mui/material'

export const StyledToggleButton = styled((props: ToggleButtonProps) => (
  <ToggleButton {...props} classes={{ selected: 'selected' }} />
))({
  color: '#6673ca',
  padding: 0,
  maxWidth: '30px',
  height: '30px',
  borderRadius: '2px',
  flex: 1,
  border: '1px solid #6673ca',
  background: '#f5f8fd',
  '&:is(:active,.selected,.selected:hover)': {
    background: '#a5b7e7',
    color: '#fff'
  },
  '&:is(:hover)': {
    background: '#f5f8fd',
    color: '#6673ca'
  }
})

export const StyledToggleButtonGroup = styled((props: ToggleButtonGroupProps) => (
  <ToggleButtonGroup {...props} classes={{ root: 'button_group' }} />
))({
  display: 'flex',
  width: '100%',
  margin: '0 auto',
  gap: '0.5rem',
  '&.MuiToggleButtonGroup-root .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
    borderLeft: '1px solid #6673ca'
  },
  '&.MuiToggleButtonGroup-root.MuiToggleButtonGroup-root .MuiToggleButtonGroup-grouped:not(:first-of-type), &.MuiToggleButtonGroup-root .MuiToggleButtonGroup-grouped:not(:last-of-type)':
    {
      borderRadius: '2px'
    }
})
