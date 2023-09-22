import { MouseEvent } from 'react'
import { Box } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenApp } from '@/hooks/open-entity'
import { ITab, ITabGroup } from '@/types/workspace'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { StyledCloseTabBtn, StyledHeadTabGroup, StyledTabWrap, StyledTitle } from './styled'
import styles from './slider.module.scss'
import 'swiper/css'

export const ModaTabSwitcher = () => {
  const { onSwitchTab, onCloseTab, onCloseAllGroupTabs } = useOpenApp()
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const currentWorkSpace = workspaces.find((workspace) => workspace.pubkey === currentPubKey)
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TABS_SWITCHER)

  const tgs = Object.values(currentWorkSpace?.tabGroups || {}).filter((tg) => tg.tabs.length > 0)
  const prepareTabs = (tabs: string[]) => {
    return currentWorkSpace?.tabs.filter((tab) => tabs.includes(tab.id))
  }

  const handleCloseModal = () => {
    if (!currentWorkSpace?.tabs.length) {
      handleClose('/')
    } else {
      handleClose()
    }
  }

  const handleOpen = async (tab: ITab) => {
    await onSwitchTab(tab)
  }

  const handleCloseTab = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation()
    onCloseTab(id)
  }

  const handleCloseTabGroup = (tabGrop: ITabGroup) => {
    onCloseAllGroupTabs(tabGrop)
  }

  return (
    <Modal title="Tabs" open={isOpen} handleClose={handleCloseModal}>
      {!tgs.length ? (
        <>No active tabs.</>
      ) : (
        tgs.map((tabGrop) => {
          const tabs = prepareTabs(tabGrop.tabs)
          return (
            <Box key={tabGrop.id}>
              <Container>
                <StyledHeadTabGroup>
                  <AppIcon isPreviewTab picture={tabGrop.info.icon} alt={tabGrop.info.title} />
                  <StyledTitle>{tabGrop.info.title}</StyledTitle>
                  <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    onClick={() => handleCloseTabGroup(tabGrop)}
                  >
                    <CloseIcon />
                  </IconButton>
                </StyledHeadTabGroup>
              </Container>
              <Swiper className={styles.container} slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
                {tabs &&
                  tabs.map((tab) => (
                    <SwiperSlide className={styles.slide} key={tab.id} onClick={() => handleOpen(tab)}>
                      <StyledTabWrap>
                        <StyledCloseTabBtn
                          size="small"
                          edge="start"
                          color="inherit"
                          aria-label="close"
                          onClick={(e) => handleCloseTab(e, tab.id)}
                        >
                          <CloseIcon />
                        </StyledCloseTabBtn>
                        <AppIcon size="big" picture={tab.screenshot || tab.icon} alt={tab.title} />
                      </StyledTabWrap>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </Box>
          )
        })
      )}
    </Modal>
  )
}
