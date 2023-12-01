import { ForwardedRef, forwardRef } from 'react'
import { Dialog, DialogProps, InputBaseProps, styled } from '@mui/material'
import { Input } from '@/shared/Input/Input'

export const StyledDialog = styled(
  forwardRef(function DialogDisplayName(props: DialogProps, ref: ForwardedRef<HTMLDivElement>) {
    return (
      <Dialog
        {...props}
        ref={ref}
        PaperProps={{
          sx(theme) {
            return {
              background: theme.palette.secondary.main,
              margin: '0',
              width: 'calc(100% - 32px)',
              maxHeight: 'calc(100% - 15rem)'
            }
          }
        }}
        fullWidth
      />
    )
  })
)({
  '& .MuiDialogTitle-root': {
    padding: '0.5rem 1rem'
  }
})

export const StyledInput = styled((props: InputBaseProps) => (
  <Input classes={{ readOnly: 'read_only', focused: 'focused' }} {...props} />
))(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'center',
  border: '1px solid transparent',
  transition: 'border 0.2s ease-in-out',
  '&:not(.read_only)': {
    border: '1px solid ' + theme.palette.text.primary
  }
}))
