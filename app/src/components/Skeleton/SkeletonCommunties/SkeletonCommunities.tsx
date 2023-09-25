import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Skeleton } from '@mui/material'
import { SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './slider.module.scss'

export const SkeletonCommunities = () => {
  const mockCommunities = generateSkeletonItems({})

  return mockCommunities.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <Wrapper>
          <Head>
            <Skeleton variant="rounded" width={32} height={32} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', flex: '1', marginLeft: '0.5rem' }} />
          </Head>
          <SubTitle>
            <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} />
          </SubTitle>
          <Content>
            <Skeleton variant="rounded" width="100%" height={50} />
          </Content>
        </Wrapper>
      </SwiperSlide>
    )
  })
}

SkeletonCommunities.displayName = 'SwiperSlide_SkeletonCommunities'
