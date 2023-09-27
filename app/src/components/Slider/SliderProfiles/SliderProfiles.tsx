import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Profile } from '@/shared/Profile/Profile'
import { ISliderProfiles } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { memo } from 'react'

export const SliderProfiles = memo(({
  data,
  isLoading,
  handleClickEntity = () => {},
  handleReloadEntity = () => {}
}: ISliderProfiles) => {
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonProfiles />
    }
    if (!data || !data.length) {
      return <EmptyListMessage onReload={handleReloadEntity} />
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
})
