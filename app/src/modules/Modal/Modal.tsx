import { forwardRef } from 'react'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { StyledAppBar, StyledDialog } from './styled'
import { IModal } from './types'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

export const Modal = ({ open, children, handleClose, title }: IModal) => {
  return (
    <StyledDialog fullScreen open={open} TransitionComponent={Transition}>
      <StyledAppBar>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <IconButton edge="start" color="inherit" aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      {children}
    </StyledDialog>
  )
}
