import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ItemBigZap } from '../../ItemsContent/ItemBigZap/ItemBigZap'
import { ISliderBigZaps } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { SkeletonBigZaps } from '@/components/Skeleton/SkeletonBigZaps/SkeletonBigZaps'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { memo } from 'react'

export const SliderBigZaps = memo(({
  data,
  isLoading,
  handleClickEntity = () => {},
  handleReloadEntity = () => {}
}: ISliderBigZaps) => {
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonBigZaps />
    }
    if (!data || !data.length) {
      return <EmptyListMessage onReload={handleReloadEntity} />
    }
    return data.map((bigZap, i) => (
      <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(bigZap)}>
        <ItemBigZap
          time={bigZap.created_at}
          subtitle={`+${Math.round(bigZap.amountMsat / 1000)} sats`}
          targetPubkey={bigZap.targetPubkey}
          targetMeta={bigZap.targetMeta}
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
