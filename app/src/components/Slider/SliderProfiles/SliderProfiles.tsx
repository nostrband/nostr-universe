import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Profile } from '@/shared/Profile/Profile'
import { ISliderProfiles } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'

export const SliderProfiles = ({ data, isLoading, handleClickEntity = () => {} }: ISliderProfiles) => {
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonProfiles />
    }
    if (!data) {
      return 'Nothing here'
    }
    return data.map((profile, i) => (
      <SwiperSlide className={styles.slide} key={i}>
        <Profile onClick={handleClickEntity} profile={profile} />
      </SwiperSlide>
    ))
  }
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {renderContent()}
    </Swiper>
  )
}
