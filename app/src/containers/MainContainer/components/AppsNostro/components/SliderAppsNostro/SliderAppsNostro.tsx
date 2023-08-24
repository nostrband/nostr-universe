import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { AppNostro as AppNostroType } from '@/types/app-nostro'
import { useOpenApp } from '@/hooks/open-entity'
import { ISliderAppsNostro } from './types'
import { StyledSlideWrapper } from './styled'
import styles from './slider.module.scss'
import 'swiper/css'

export const SliderAppsNostro = ({ data, isLoading }: ISliderAppsNostro) => {
  const { openApp } = useOpenApp()

  const handleOpenApp = async (app: AppNostroType) => {
    await openApp(app)
  }

  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading
        ? 'Loading'
        : data.map((app, i) => (
            <SwiperSlide className={styles.slide} key={i}>
              <StyledSlideWrapper>
                <AppNostro app={app} onOpen={handleOpenApp} />
              </StyledSlideWrapper>
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
