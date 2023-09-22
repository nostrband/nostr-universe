import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { ItemBigZap } from '../../ItemsContent/ItemBigZap/ItemBigZap'
import { ISliderBigZaps } from './types'
import 'swiper/css'
import styles from './slider.module.scss'

export const SliderBigZaps = ({ data, isLoading, handleClickEntity = () => {} }: ISliderBigZaps) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading || !data
        ? 'Loading'
        : data.map((bigZap, i) => (
            <SwiperSlide className={styles.slide} key={i} onClick={() => handleClickEntity(bigZap)}>
              <ItemBigZap
                time={bigZap.created_at}
                subtitle={`+${Math.round(bigZap.amountMsat / 1000)} sats`}
                targetPubkey={bigZap.targetPubkey}
                targetMeta={bigZap.targetMeta}
              />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
