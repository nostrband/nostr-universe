import { forwardRef } from 'react'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledDialog } from './styled'
import { TabPageContent } from './TabPageContent'

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
      {isOpen && <TabPageContent />}
    </StyledDialog>
  )
}
