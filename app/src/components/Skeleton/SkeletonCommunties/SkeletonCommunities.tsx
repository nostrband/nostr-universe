import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonCommunities = () => {
  const mockCommunities = generateSkeletonItems({})

  return mockCommunities.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <Wrapper>
          <Head>
            <SkeletonAvatar variant="rounded" />
            <SkeletonText hasSpacing />
          </Head>
          <SubTitle>
            <SkeletonText size="small" />
          </SubTitle>
          <Content>
            <SkeletonContent size="large" />
          </Content>
        </Wrapper>
      </SwiperSlide>
    )
  })
}

SkeletonCommunities.displayName = 'SwiperSlide_SkeletonCommunities'
