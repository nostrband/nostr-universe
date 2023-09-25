import { StyledProfile } from '@/shared/Profile/styled'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Skeleton } from '@mui/material'
import { SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './slider.module.scss'

export const SkeletonProfiles = () => {
  const mockProfiles = generateSkeletonItems({})

  return mockProfiles.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <StyledProfile>
          <Skeleton variant="circular" width={50} height={50} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', minWidth: '5rem' }} />
          <Skeleton variant="rounded" height={40} sx={{ minWidth: '90%' }} />
        </StyledProfile>
      </SwiperSlide>
    )
  })
}

SkeletonProfiles.displayName = 'SwiperSlide_SkeletonProfiles'
