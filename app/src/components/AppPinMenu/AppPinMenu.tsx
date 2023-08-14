import { useState } from 'react'
import { Global } from '@emotion/react'
import { SwipeableDrawer, Grid } from '@mui/material'
import { Puller, StyledPinApps, StyledSwipeableDrawerContent } from './styled'
import { IAppPinMenu } from './types'
import { drawerBleeding } from './const'
import { Container } from '../../layout/Container/Conatiner'
import { AppNostro } from '../../shared/AppNostro/AppNostro'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import './style.css'

const dataAppsNostro = [
  {
    name: 'Cygnus-21',
    img: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Eclipse-47',
    img: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Chronotro...',
    img: 'https://i.pravatar.cc/150?img=4'
  },
  {
    name: 'Helix-27',
    img: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'Omega-50',
    img: 'https://i.pravatar.cc/150?img=6'
  },
  {
    name: 'Cygnus-21',
    img: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Eclipse-47',
    img: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Chronotro...',
    img: 'https://i.pravatar.cc/150?img=4'
  },
  {
    name: 'Helix-27',
    img: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'Omega-50',
    img: 'https://i.pravatar.cc/150?img=6'
  },
  {
    name: 'Cygnus-21',
    img: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Eclipse-47',
    img: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Chronotro...',
    img: 'https://i.pravatar.cc/150?img=4'
  },
  {
    name: 'Helix-27',
    img: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'Omega-50',
    img: 'https://i.pravatar.cc/150?img=6'
  },
  {
    name: 'Cygnus-21',
    img: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Eclipse-47',
    img: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Chronotro...',
    img: 'https://i.pravatar.cc/150?img=4'
  },
  {
    name: 'Helix-27',
    img: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'Omega-50',
    img: 'https://i.pravatar.cc/150?img=6'
  },
  {
    name: 'Cygnus-21',
    img: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Eclipse-47',
    img: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Chronotro...',
    img: 'https://i.pravatar.cc/150?img=4'
  },
  {
    name: 'Helix-27',
    img: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'Omega-50',
    img: 'https://i.pravatar.cc/150?img=6'
  },
  {
    name: 'Cygnus-21',
    img: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Eclipse-47',
    img: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Chronotro...',
    img: 'https://i.pravatar.cc/150?img=4'
  },
  {
    name: 'Helix-27',
    img: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'Omega-50',
    img: 'https://i.pravatar.cc/150?img=6'
  }
]

export const AppPinMenu = (props: IAppPinMenu) => {
  const { window } = props
  const [open, setOpen] = useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <>
      {/* rewrite to styled */}
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(80% - ${drawerBleeding}px)`,
            overflow: 'visible'
          }
        }}
      />

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        allowSwipeInChildren={true}
        ModalProps={{
          keepMounted: true
        }}
        transitionDuration={200}
      >
        <StyledPinApps drawerBleeding={drawerBleeding}>
          <Puller />
          <Swiper
            slidesPerView="auto"
            freeMode={true}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            modules={[FreeMode]}
          >
            {dataAppsNostro.map((app, i) => (
              <SwiperSlide key={i}>
                <AppNostro app={app} size="small" hideName />
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledPinApps>
        <StyledSwipeableDrawerContent>
          <Container>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {dataAppsNostro.map((app, i) => (
                <Grid key={i} item xs={3}>
                  <AppNostro app={app} size="medium" />
                </Grid>
              ))}
            </Grid>
          </Container>
        </StyledSwipeableDrawerContent>
      </SwipeableDrawer>
    </>
  )
}
