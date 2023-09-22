import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ItemHighlight } from '../../ItemsContent/ItemHighlight/ItemHighlight'
import { ISliderHighlights } from './types'
import 'swiper/css'
import styles from './slider.module.scss'

export const SliderHighlights = ({ data, isLoading, handleClickEntity = () => {} }: ISliderHighlights) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((highlight, i) => (
            <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(highlight)}>
              <ItemHighlight
                time={highlight.created_at}
                content={highlight.content}
                pubkey={highlight.pubkey}
                author={highlight.author}
              />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
