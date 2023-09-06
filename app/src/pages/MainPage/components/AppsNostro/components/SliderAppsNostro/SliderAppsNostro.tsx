import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { AppNostro as AppNostroType } from '@/types/app-nostro'
import { useOpenApp } from '@/hooks/open-entity'
// import { useOpenModalSearchParams } from '@/hooks/modal'
// import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ISliderAppsNostro } from './types'
import styles from './slider.module.scss'
import 'swiper/css'

export const SliderAppsNostro = ({ data, isLoading }: ISliderAppsNostro) => {
  const { openApp } = useOpenApp()

  const handleOpenApp = async (app: AppNostroType) => {
    await openApp(app)
    // handleOpen(MODAL_PARAMS_KEYS.TAB_MODAL)
  }

  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {isLoading
        ? 'Loading'
        : data.map((app, i) => (
            <SwiperSlide className={styles.slide} key={i}>
              <AppNostro app={app} onOpen={handleOpenApp} />
            </SwiperSlide>
          ))}
    </Swiper>
  )
}
