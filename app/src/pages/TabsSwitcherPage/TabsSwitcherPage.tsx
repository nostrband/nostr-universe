import { MouseEvent } from 'react'
import { Box, IconButton } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import CloseIcon from '@mui/icons-material/Close'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { Container } from '@/layout/Container/Conatiner'
import {
  StyledAppBar,
  StyledDialog,
  StyledHeadTabGroup,
  StyledCloseTabBtn,
  StyledTabWrap,
  StyledTitle,
  StyledWrap
} from './styled'
import { Header } from '@/components/Header/Header'
import { useOpenApp } from '@/hooks/open-entity'
import { useAppSelector } from '@/store/hooks/redux'
import { ITab, ITabGroup } from '@/types/workspace'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import styles from './slider.module.scss'
import 'swiper/css'

export const TabsSwitcherPage = () => {
  const { onSwitchTab, onCloseTab, onCloseAllGroupTabs } = useOpenApp()
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const currentWorkSpace = workspaces.find((workspace) => workspace.pubkey === currentPubKey)
  const { getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TABS_SWITCHER_PAGE)

  const tgs = Object.values(currentWorkSpace?.tabGroups || {}).filter((tg) => tg.tabs.length > 0)
  const prepareTabs = (tabs: string[]) => {
    return currentWorkSpace?.tabs.filter((tab) => tabs.includes(tab.id))
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
    <StyledDialog fullScreen open={isOpen}>
      <StyledAppBar>
        <Header />
      </StyledAppBar>

      <StyledWrap>
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
      </StyledWrap>
    </StyledDialog>
  )
}
