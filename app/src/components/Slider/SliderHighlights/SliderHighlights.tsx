import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ItemHighlight } from '../../ItemsContent/ItemHighlight/ItemHighlight'
import { ISliderHighlights } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonHighlights } from '@/components/Skeleton/SkeletonHighlights/SkeletonHighlights'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { memo } from 'react'

export const SliderHighlights = memo(function SliderHighlights({
  data,
  isLoading,
  handleClickEntity = () => {},
  handleReloadEntity = () => {}
}: ISliderHighlights) {
  // depends on all props, no need to useCallback
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonHighlights />
    }
    if (!data || !data.length) {
      return <EmptyListMessage onReload={handleReloadEntity} />
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
})
