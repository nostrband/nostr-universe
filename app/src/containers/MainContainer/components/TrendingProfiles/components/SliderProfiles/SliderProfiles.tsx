import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { Profile } from '../Profile/Profile'
import { ISliderProfiles } from './types'
import { StyledSlideWrapper } from './styled'
import 'swiper/css'
import './style.css'

export const SliderProfiles = ({ data }: ISliderProfiles) => {
  return (
    <Swiper
      slidesPerView="auto"
      freeMode={true}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      modules={[FreeMode]}
    >
      {data.map((profile, i) => (
        <SwiperSlide key={i}>
          <StyledSlideWrapper>
            <Profile profile={profile} />
          </StyledSlideWrapper>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
