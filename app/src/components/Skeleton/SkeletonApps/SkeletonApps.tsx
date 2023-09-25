import { StyledAppWraper } from '@/shared/AppNostro/styled'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Skeleton } from '@mui/material'
import { SwiperSlide } from 'swiper/react'
import styles from './slider.module.scss'
import 'swiper/css'

export const SkeletonApps = () => {
  const mockApps = generateSkeletonItems({})

  return mockApps.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <StyledAppWraper>
          <Skeleton variant="rounded" width={72} height={72} />
          <Skeleton variant="text" width={'5rem'} sx={{ fontSize: '1rem' }} />
        </StyledAppWraper>
      </SwiperSlide>
    )
  })
}

SkeletonApps.displayName = 'SwiperSlide_SkeletonApps'
