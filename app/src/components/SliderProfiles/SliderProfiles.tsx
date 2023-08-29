import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Profile } from '@/shared/Profile/Profile'
import { ISliderProfiles } from './types'
import 'swiper/css'
import styles from './slider.module.scss'

export const SliderProfiles = ({ data, isLoading, handleClickEntity = () => {} }: ISliderProfiles) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((profile, i) => (
            <SwiperSlide className={styles.slide} key={i}>
              <Profile onClick={handleClickEntity} profile={profile} />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
