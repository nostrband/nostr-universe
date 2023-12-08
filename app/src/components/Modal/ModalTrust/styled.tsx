import { Container } from '@/layout/Container/Conatiner'
import { Button, ButtonProps, styled } from '@mui/material'

export const StyledButton = styled((props: ButtonProps) => (
  <Button {...props} variant="contained" color="actionPrimary" />
))(() => ({
  '&:hover': {
    background: '#424242'
  }
}))

export const StyledContainer = styled(Container)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
})
