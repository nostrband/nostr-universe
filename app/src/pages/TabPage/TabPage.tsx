import { forwardRef } from 'react'
// import Toolbar from '@mui/material/Toolbar'
// import IconButton from '@mui/material/IconButton'
// import Typography from '@mui/material/Typography'
// import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { StyledAppBar, StyledDialog } from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

export const TabPage = () => {
  const { getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TAB_MODAL)

  return (
    <StyledDialog fullScreen open={isOpen} TransitionComponent={Transition}>
      <StyledAppBar>
        {/* <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <IconButton edge="start" color="inherit" aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar> */}
      </StyledAppBar>
      {/* {children} */}
    </StyledDialog>
  )
}
