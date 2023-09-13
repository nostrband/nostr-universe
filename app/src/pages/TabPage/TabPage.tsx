import { forwardRef, useEffect } from 'react'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useSearchParams } from 'react-router-dom'
import { useOpenApp } from '@/hooks/open-entity'
import { TabMenu } from '@/components/TabMenu/TabMenu'
import { Header } from './components/Header/Header'
import { StyledAppBar, StyledAppImg, StyledAppPreview, StyledDialog, StyledViewName, StyledWrap } from './styled'
import { useAppSelector } from '@/store/hooks/redux'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

export const TabPage = () => {
  const { openTabWindow, onHideTabInBrowser } = useOpenApp()
  const [searchParams] = useSearchParams()
  const { getModalOpened } = useOpenModalSearchParams()
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const { isLoading } = useAppSelector((state) => state.tab)
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TAB_MODAL)
  const id = searchParams.get('id')
  const method = searchParams.get('method')
  const tab = currentWorkSpace.tabs.find((tab) => tab.id === id)

  // const handleOpen = () => { // use this method letter
  //   if (id && method) {
  //     openTabWindow(id, method)
  //   }
  // }
  console.log({ tab })

  useEffect(() => {
    if (id && method) {
      openTabWindow(id, method)
      return () => {
        onHideTabInBrowser(id)
      }
    }
  }, [id, method, onHideTabInBrowser, openTabWindow])

  return (
    <StyledDialog
      // TransitionProps={{ onEntered: handleOpen }}
      fullScreen
      open={isOpen}
      TransitionComponent={Transition}
    >
      <StyledAppBar>
        <Header />
      </StyledAppBar>

      <StyledWrap>
        <StyledAppPreview>
          <StyledAppImg src={tab?.icon} />
        </StyledAppPreview>
        <StyledViewName>{tab?.title}</StyledViewName>
        {isLoading && <StyledViewName variant="body2">Loading...</StyledViewName>}
      </StyledWrap>

      <TabMenu />
    </StyledDialog>
  )
}
