import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ISliderLongPost } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { ItemLongPost } from '../../ItemsContent/ItemLongPost/ItemLongPost'

export const SliderLongPosts = ({ data, isLoading, handleClickEntity = () => {} }: ISliderLongPost) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((longPost, i) => (
            <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(longPost)}>
              <ItemLongPost
                time={longPost.created_at}
                content={longPost.content}
                subtitle={longPost.title}
                name={longPost.author.profile.name}
                picture={longPost.author.profile.picture}
              />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
