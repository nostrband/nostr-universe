import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { getRenderedUsername } from '@/utils/helpers/general'
import { ItemBigZap } from '../../ItemsContent/ItemBigZap/ItemBigZap'
import { ISliderBigZaps } from './types'
import 'swiper/css'
import styles from './slider.module.scss'
import { cropName } from '@/utils/helpers/prepare-data'

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
                name={cropName(getRenderedUsername(bigZap.targetMeta, bigZap.targetPubkey), 11)}
                picture={bigZap.targetMeta?.profile.picture}
              />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
