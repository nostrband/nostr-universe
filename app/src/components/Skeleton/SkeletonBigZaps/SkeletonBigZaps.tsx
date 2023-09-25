import { SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './slider.module.scss'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { Skeleton } from '@mui/material'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'

export const SkeletonBigZaps = () => {
  const mockBigZaps = generateSkeletonItems({})

  return mockBigZaps.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <Wrapper>
          <Head>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', flex: '1', marginLeft: '0.5rem' }} />
          </Head>
          <SubTitle>
            <Skeleton variant="text" sx={{ fontSize: '0.8rem', flex: '1' }} />
          </SubTitle>
        </Wrapper>
      </SwiperSlide>
    )
  })
}

SkeletonBigZaps.displayName = 'SwiperSlide_SkeletonBigZaps'
