import { StyledProfile } from '@/shared/Profile/styled'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonProfiles = () => {
  const mockProfiles = generateSkeletonItems({})

  return mockProfiles.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <StyledProfile>
          <SkeletonAvatar size="large" />
          <SkeletonText width={'4rem'} fullWidth={false} />
          <SkeletonContent width="90%" />
        </StyledProfile>
      </SwiperSlide>
    )
  })
}

SkeletonProfiles.displayName = 'SwiperSlide_SkeletonProfiles'
