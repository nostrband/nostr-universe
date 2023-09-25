import { SwiperSlide } from 'swiper/react'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Skeleton } from '@mui/material'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { Content } from '@/shared/ContentComponents/Content/Content'
import 'swiper/css'
import styles from './slider.module.scss'

export const SkeletonHighlights = () => {
  const mockHighlights = generateSkeletonItems({})

  return mockHighlights.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <Wrapper>
          <Head>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', flex: '1', marginLeft: '0.5rem' }} />
          </Head>
          <Content isHighlight>
            <Skeleton variant="rounded" width="100%" height={60} />
          </Content>
        </Wrapper>
      </SwiperSlide>
    )
  })
}

SkeletonHighlights.displayName = 'SwiperSlide_SkeletonProfiles'
