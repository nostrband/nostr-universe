import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { AppNostro } from '../../../../../../shared/AppNostro/AppNostro'
import { ISliderAppsNostro } from './types'
import { StyledSlideWrapper } from './styled'
import styles from './slider.module.scss'
import 'swiper/css'

export const SliderAppsNostro = ({ data }: ISliderAppsNostro) => {
  return (
    <Swiper
      slidesPerView="auto"
      freeMode={true}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      modules={[FreeMode]}
    >
      {data.map((app, i) => (
        <SwiperSlide className={styles.slide} key={i}>
          <StyledSlideWrapper>
            <AppNostro app={app} />
          </StyledSlideWrapper>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
