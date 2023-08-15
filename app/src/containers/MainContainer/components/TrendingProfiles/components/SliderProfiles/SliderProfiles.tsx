import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Profile } from '../Profile/Profile'
import { ISliderProfiles } from './types'
import { StyledSlideWrapper } from './styled'
import styles from './slider.module.scss'
import 'swiper/css'

export const SliderProfiles = ({ data }: ISliderProfiles) => {
  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {data.map((profile, i) => (
        <SwiperSlide className={styles.slide} key={i}>
          <StyledSlideWrapper>
            <Profile profile={profile} />
          </StyledSlideWrapper>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
