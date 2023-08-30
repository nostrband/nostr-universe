import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Profile } from '@/shared/Profile/Profile'
import { ISliderContacts } from './types'
import 'swiper/css'
import styles from './slider.module.scss'

export const SliderContacts = ({ data, isLoading, handleClickEntity = () => {} }: ISliderContacts) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((profile, i) => (
            <SwiperSlide className={styles.slide} key={i}>
              <Profile isContact onClick={handleClickEntity} profile={profile} />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
