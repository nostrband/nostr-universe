import { Button, ButtonProps, Typography, TypographyProps, styled } from '@mui/material'
import { forwardRef } from 'react'

export const StyledMessage = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function MessageDisplayName(props, ref) {
    return <Typography variant="body1" ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  paddingLeft: '1rem'
}))

export const StyledReloadButton = styled(
  forwardRef<HTMLButtonElement, ButtonProps>(function ReloadButtonDisplayName(props, ref) {
    return <Button variant="text" type="button" {...props} ref={ref} />
  })
)(({ theme }) => ({
  padding: '0 0.2rem',
  textTransform: 'lowercase',
  justifyContent: 'flex-start',
  minWidth: 'auto',
  color: theme.palette.textSecondaryDecorate.main,
  textDecoration: 'underline',
  '&:hover': {
    textDecoration: 'underline'
  },
  fontSize: 'inherit'
}))
