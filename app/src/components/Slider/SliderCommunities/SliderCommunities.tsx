import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ItemCommunity } from '@/components/ItemsContent/ItemCommunity/ItemCommunity'
import styles from './slider.module.scss'
import { ISliderCommunities } from './types'
import 'swiper/css'
import { SkeletonCommunities } from '@/components/Skeleton/SkeletonCommunties/SkeletonCommunities'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { memo } from 'react'

export const SliderCommunities = memo(function SliderCommunities({
  data,
  isLoading,
  handleClickEntity = () => {},
  handleReloadEntity = () => {}
}: ISliderCommunities) {
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonCommunities />
    }
    if (!data || !data.length) {
      return <EmptyListMessage onReload={handleReloadEntity} />
    }
    return data.map((community, i) => (
      <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(community)}>
        <ItemCommunity
          time={community.last_post_tm}
          content={community.description}
          subtitle={`+${community.posts} posts`}
          name={`/${community.name}`}
          picture={community.image}
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
