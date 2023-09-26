import { MouseEvent } from 'react'
import { Box, IconButton } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenApp } from '@/hooks/open-entity'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import CloseIcon from '@mui/icons-material/Close'
import { StyledCloseTabBtn, StyledHeadTabGroup, StyledTabWrap, StyledTitle } from './styled'
import styles from './slider.module.scss'
import 'swiper/css'
import { ITabGroup, selectCurrentWorkspace, selectTabGroups } from '@/store/store'
import { ITab } from '@/types/tab'

export const ModalTabSwitcher = () => {
  const { onSwitchTab, onCloseTab, onCloseTabs } = useOpenApp()
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const tgs = useAppSelector(selectTabGroups)

  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TABS_SWITCHER)

  const handleCloseModal = () => {
    if (!currentWorkSpace?.tabIds.length) {
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

  const handleCloseTabGroup = (tg: ITabGroup) => {
    onCloseTabs(tg.tabs)
  }

  return (
    <Modal title="Tabs" open={isOpen} handleClose={handleCloseModal}>
      {!tgs.length ? (
        <>No active tabs.</>
      ) : (
        tgs.map((tg) => {
          const info = tg.tabs[0]
          return (
            <Box key={tg.id}>
              <Container>
                <StyledHeadTabGroup>
                  <AppIcon isPreviewTab picture={info.icon} alt={info.title} />
                  <StyledTitle>{info.title}</StyledTitle>
                  <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    onClick={() => handleCloseTabGroup(tg)}
                  >
                    <CloseIcon />
                  </IconButton>
                </StyledHeadTabGroup>
              </Container>
              <Swiper className={styles.container} slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
                {tg.tabs.map((tab) => (
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
