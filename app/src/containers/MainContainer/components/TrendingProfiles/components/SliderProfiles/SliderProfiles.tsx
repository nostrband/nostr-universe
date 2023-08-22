import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Profile } from '../Profile/Profile'
import { ISliderProfiles } from './types'
import styles from './slider.module.scss'
import 'swiper/css'

export const SliderProfiles = ({ data, isLoading }: ISliderProfiles) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((profile, i) => (
            <SwiperSlide className={styles.slide} key={i}>
              <Profile profile={profile} />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
