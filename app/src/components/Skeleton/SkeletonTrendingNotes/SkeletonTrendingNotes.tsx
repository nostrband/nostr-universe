import { Head } from '@/shared/ContentComponents/Head/Head'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { SwiperSlide } from 'swiper/react'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonTrendingNotes = () => {
  const mockTrendingNotes = generateSkeletonItems({})
  return mockTrendingNotes.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <Wrapper>
          <Head>
            <SkeletonAvatar />
            <SkeletonText hasSpacing />
          </Head>
          <Content>
            <SkeletonContent size="big" />
          </Content>
        </Wrapper>
      </SwiperSlide>
    )
  })
}

SkeletonTrendingNotes.displayName = 'SwiperSlide_SkeletonTrendingNotes'
