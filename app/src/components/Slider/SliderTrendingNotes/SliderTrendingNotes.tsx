import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ISliderTrendingNotes } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { ItemTrendingNote } from '../../ItemsContent/ItemTrendingNote/ItemTrendingNote'

export const SliderTrendingNotes = ({ data, isLoading, handleClickEntity = () => {} }: ISliderTrendingNotes) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((note, i) => (
            <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(note)}>
              <ItemTrendingNote
                time={note.created_at}
                content={note.content}
                name={note.author?.profile?.name}
                picture={note.author?.profile?.picture}
              />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
