import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ItemHighlight } from '../../ItemsContent/ItemHighlight/ItemHighlight'
import { ISliderHighlights } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonHighlights } from '@/components/Skeleton/SkeletonHighlights/SkeletonHighlights'

export const SliderHighlights = ({ data, isLoading, handleClickEntity = () => {} }: ISliderHighlights) => {
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonHighlights />
    }
    if (!data) {
      return 'Nothing here'
    }
    return data.map((highlight, i) => (
      <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(highlight)}>
        <ItemHighlight
          time={highlight.created_at}
          content={highlight.content}
          pubkey={highlight.pubkey}
          author={highlight.author}
        />
      </SwiperSlide>
    ))
  }
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {renderContent()}
    </Swiper>
  )
}
