import { useState } from 'react'
import { Global } from '@emotion/react'
import { Grid } from '@mui/material'
import { useAppSelector } from '@/store/hooks/redux'
import { Container } from '@/layout/Container/Conatiner'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { AppNostro as AppNostroType } from '@/types/app-nostro'
import { useOpenApp } from '@/hooks/open-entity'
import { Puller, StyledSwipeableMenu, StyledPinApps, StyledSwipeableDrawerContent } from './styled'
import { IAppPinMenu } from './types'
import { drawerbleeding } from './const'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import styles from './slider.module.scss'

export const AppPinMenu = (props: IAppPinMenu) => {
  const { openApp } = useOpenApp()
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const { window } = props
  const [open, setOpen] = useState(false)
  const [isDrag, setDrag] = useState<boolean>(false)
  const [initialPoint, setInitialPoint] = useState<null | number>(null)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const container = window !== undefined ? () => window().document.body : undefined

  const tabGroups = currentWorkSpace?.tabGroups

  const handleOpen = async (app: AppNostroType) => {
    await openApp(app)
  }

  return (
    <>
      {/* rewrite to styled */}
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(80% - ${drawerbleeding}px)`,
            overflow: 'visible'
          }
        }}
      />

      <StyledSwipeableMenu
        container={container}
        anchor="bottom"
        open={open}
        isdrag={isDrag ? 1 : 0}
        initialpoint={initialPoint}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerbleeding}
        disableSwipeToOpen={false}
        allowSwipeInChildren={(...args: [TouchEvent, HTMLElement, HTMLElement]) => {
          const paper = args[2]
          setInitialPoint(paper.clientHeight)

          return true
        }}
        ModalProps={{
          keepMounted: true
        }}
        // transitionDuration={300}
      >
        <StyledPinApps
          drawerbleeding={drawerbleeding}
          open={open}
          onTouchMove={() => {
            setDrag(true)
          }}
          onTouchEnd={() => {
            setDrag(false)
          }}
        >
          <Puller />
          <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
            {!open &&
              tabGroups.map((tab, i) => {
                const app = {
                  picture: tab.info.icon,
                  name: tab.info.title,
                  naddr: tab.info.appNaddr,
                  url: tab.info.url,
                  order: tab.info.order
                }

                const isActive = Boolean(tab.tabs.length)

                return (
                  <SwiperSlide className={styles.slide} key={i}>
                    <AppNostro isActive={isActive} app={app} size="extra-small" hideName onOpen={handleOpen} />
                  </SwiperSlide>
                )
              })}
          </Swiper>
        </StyledPinApps>
        <StyledSwipeableDrawerContent>
          <Container>
            <Grid columns={10} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {tabGroups.map((tab, i) => {
                const app = {
                  picture: tab.info.icon,
                  name: tab.info.title,
                  naddr: tab.info.appNaddr,
                  url: tab.info.url,
                  order: tab.info.order
                }

                const isActive = Boolean(tab.tabs.length)

                return (
                  <Grid key={i} item xs={2}>
                    <AppNostro isActive={isActive} app={app} size="small" onOpen={handleOpen} />
                  </Grid>
                )
              })}
            </Grid>
          </Container>
        </StyledSwipeableDrawerContent>
      </StyledSwipeableMenu>
    </>
  )
}
