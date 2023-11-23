import { DialogProps } from '@mui/material'

export interface IModal {
  children: React.ReactNode
  title: string
  open: boolean
  zIndex?: number
  handleClose: () => void
}

export interface IStyledDialogProps extends DialogProps {
  zIndex?: number
}
