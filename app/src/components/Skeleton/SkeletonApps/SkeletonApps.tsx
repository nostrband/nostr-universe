import { StyledAppWraper } from '@/shared/AppNostro/styled'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { SwiperSlide } from 'swiper/react'
import styles from './slider.module.scss'
import 'swiper/css'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'

export const SkeletonApps = () => {
  const mockApps = generateSkeletonItems({})

  return mockApps.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <StyledAppWraper>
          <SkeletonAvatar variant="rounded" size="big" />
          <SkeletonText width={'4rem'} fullWidth={false} />
        </StyledAppWraper>
      </SwiperSlide>
    )
  })
}

SkeletonApps.displayName = 'SwiperSlide_SkeletonApps'
