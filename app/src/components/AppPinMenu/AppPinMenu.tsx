import { useState } from 'react'
import { Global } from '@emotion/react'
import { Grid } from '@mui/material'
import { Puller, StyledSwipeableMenu, StyledPinApps, StyledSwipeableDrawerContent } from './styled'
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
  const [isDrag, setDrag] = useState<boolean>(false)
  const [initialPoint, setInitialPoint] = useState<null | number>(null)

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
              dataAppsNostro.map((app, i) => (
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
      </StyledSwipeableMenu>
    </>
  )
}
