import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ItemCommunitie } from '@/components/ItemsContent/ItemCommunitie/ItemCommunitie'
import styles from './slider.module.scss'
import { ISliderCommunities } from './types'
import 'swiper/css'

export const SliderCommunities = ({ data, isLoading, handleClickEntity = () => {} }: ISliderCommunities) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((communitie, i) => (
            <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(communitie)}>
              <ItemCommunitie
                time={communitie.last_post_tm}
                content={communitie.description}
                subtitle={`+${communitie.posts} posts`}
                name={`/${communitie.name}`}
                picture={communitie.image}
              />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
