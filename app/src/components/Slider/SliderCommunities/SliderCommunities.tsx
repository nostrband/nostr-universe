import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ItemCommunity } from '@/components/ItemsContent/ItemCommunity/ItemCommunity'
import styles from './slider.module.scss'
import { ISliderCommunities } from './types'
import 'swiper/css'

export const SliderCommunities = ({ data, isLoading, handleClickEntity = () => {} }: ISliderCommunities) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((community, i) => (
            <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(community)}>
              <ItemCommunity
                time={community.last_post_tm}
                content={community.description}
                subtitle={`+${community.posts} posts`}
                name={`/${community.name}`}
                picture={community.image}
              />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
