import { useState } from 'react'
import { Global } from '@emotion/react'
import { SwipeableDrawer, Grid } from '@mui/material'
import { Puller, StyledPinApps, StyledSwipeableDrawerContent } from './styled'
import { IAppPinMenu } from './types'
import { drawerbleeding } from './const'
import { Container } from '../../layout/Container/Conatiner'
import { AppNostro } from '../../shared/AppNostro/AppNostro'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import styles from './slider.module.scss'
import 'swiper/css'

const dataAppsNostro = [
  {
    name: 'Cygnus-21',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Eclipse-47',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Chronotro...',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Helix-27',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Omega-50',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Cygnus-21',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Eclipse-47',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Chronotro...',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Helix-27',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Omega-50',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Cygnus-21',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Eclipse-47',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Chronotro...',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Helix-27',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Omega-50',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Cygnus-21',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Eclipse-47',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Chronotro...',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Helix-27',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Omega-50',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Cygnus-21',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Eclipse-47',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Chronotro...',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Helix-27',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Omega-50',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Cygnus-21',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Eclipse-47',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Chronotro...',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Helix-27',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Omega-50',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
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
            height: `calc(80% - ${drawerbleeding}px)`,
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
        swipeAreaWidth={drawerbleeding}
        disableSwipeToOpen={false}
        allowSwipeInChildren={true}
        ModalProps={{
          keepMounted: true
        }}
        transitionDuration={200}
      >
        <StyledPinApps drawerbleeding={drawerbleeding}>
          <Puller />
          <Swiper
            slidesPerView="auto"
            freeMode={true}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            modules={[FreeMode]}
          >
            {dataAppsNostro.map((app, i) => (
              <SwiperSlide className={styles.slide} key={i}>
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
