import { useState } from 'react'
import { Global } from '@emotion/react'
import { Grid } from '@mui/material'
import { useAppSelector } from '@/store/hooks/redux'
import { Puller, StyledSwipeableMenu, StyledPinApps, StyledSwipeableDrawerContent } from './styled'
import { IAppPinMenu } from './types'
import { drawerbleeding } from './const'
import { Container } from '@/layout/Container/Conatiner'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import styles from './slider.module.scss'
import 'swiper/css'

export const AppPinMenu = (props: IAppPinMenu) => {
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const { window } = props
  const [open, setOpen] = useState(false)
  const [isDrag, setDrag] = useState<boolean>(false)
  const [initialPoint, setInitialPoint] = useState<null | number>(null)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const container = window !== undefined ? () => window().document.body : undefined

  const pins = currentWorkSpace?.pins.map((el) => ({ icon: el.icon, title: el.title }))

  console.log(currentWorkSpace)

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
              pins &&
              pins.map((app, i) => (
                <SwiperSlide className={styles.slide} key={i}>
                  <AppNostro app={app} size="small" hideName />
                </SwiperSlide>
              ))}
          </Swiper>
        </StyledPinApps>
        <StyledSwipeableDrawerContent>
          <Container>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {pins &&
                pins.map((app, i) => (
                  <Grid key={i} item xs={3}>
                    <AppNostro app={app} size="medium" />
                  </Grid>
                ))}
            </Grid>
          </Container>
        </StyledSwipeableDrawerContent>
      </StyledSwipeableMenu>
    </>
  )
}
