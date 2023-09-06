import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'

import 'swiper/css'
import styles from './slider.module.scss'
import { ISliderLiveEvents } from './types'
import { ItemLiveEvent } from '@/components/ItemsContent/ItemLiveEvent/ItemLiveEvent'

export const SliderLiveEvents = ({ data, isLoading, handleClickEntity = () => {} }: ISliderLiveEvents) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((event, i) => (
            <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(event)}>
              <ItemLiveEvent
                key={event.id}
                time={event.starts || event.created_at}
                name={event.hostMeta.profile.name}
                picture={event.hostMeta.profile.picture}
                subtitle={event.title}
                content={event.summary || event.content.substring(0, 300)}
                status={event.status}
              />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
