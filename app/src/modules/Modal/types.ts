export interface IModal {
  children: React.ReactNode
  title: string
  open: boolean
  handleClose: () => void
}
