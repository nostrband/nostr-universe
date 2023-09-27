import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import styles from './slider.module.scss'
import { ISliderLiveEvents } from './types'
import { ItemLiveEvent } from '@/components/ItemsContent/ItemLiveEvent/ItemLiveEvent'
import { SkeletonLiveEvents } from '@/components/Skeleton/SkeletonLiveEvents/SkeletonLiveEvents'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { memo } from 'react'

export const SliderLiveEvents = memo(({
  data,
  isLoading,
  handleClickEntity = () => {},
  handleReloadEntity = () => {}
}: ISliderLiveEvents) => {

  // depends on all props, no need to useCallback
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLiveEvents />
    }
    if (!data || !data.length) {
      return <EmptyListMessage onReload={handleReloadEntity} />
    }
    return data.map((event, i) => (
      <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(event)}>
        <ItemLiveEvent
          key={event.id}
          time={event.starts || event.created_at}
          hostPubkey={event.host}
          host={event.hostMeta}
          subtitle={event.title}
          content={event.summary || event.content.substring(0, 300)}
          status={event.status}
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
