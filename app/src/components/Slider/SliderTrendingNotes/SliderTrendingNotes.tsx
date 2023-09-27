import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ISliderTrendingNotes } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { ItemTrendingNote } from '../../ItemsContent/ItemTrendingNote/ItemTrendingNote'
import { SkeletonTrendingNotes } from '@/components/Skeleton/SkeletonTrendingNotes/SkeletonTrendingNotes'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { memo } from 'react'

export const SliderTrendingNotes = memo(({
  data,
  isLoading,
  handleClickEntity = () => {},
  handleReloadEntity = () => {}
}: ISliderTrendingNotes) => {
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonTrendingNotes />
    }
    if (!data || !data.length) {
      return <EmptyListMessage onReload={handleReloadEntity} />
    }
    return data.map((note, i) => (
      <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(note)}>
        <ItemTrendingNote time={note.created_at} content={note.content} pubkey={note.pubkey} author={note.author} />
      </SwiperSlide>
    ))
  }

  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {renderContent()}
    </Swiper>
  )
})
