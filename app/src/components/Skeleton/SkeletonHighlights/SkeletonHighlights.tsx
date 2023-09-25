import { SwiperSlide } from 'swiper/react'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { Content } from '@/shared/ContentComponents/Content/Content'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonHighlights = () => {
  const mockHighlights = generateSkeletonItems({})

  return mockHighlights.map((_, index) => {
    return (
      <SwiperSlide key={`slide_${index}`} className={styles.slide}>
        <Wrapper>
          <Head>
            <SkeletonAvatar />
            <SkeletonText hasSpacing />
          </Head>
          <Content isHighlight>
            <SkeletonContent size="big" />
          </Content>
        </Wrapper>
      </SwiperSlide>
    )
  })
}

SkeletonHighlights.displayName = 'SwiperSlide_SkeletonProfiles'
