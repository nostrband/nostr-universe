import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { AppNostr as AppNostroType } from '@/types/app-nostr'
import { useOpenApp } from '@/hooks/open-entity'
import { ISliderAppsNostro } from './types'
import styles from './slider.module.scss'
import 'swiper/css'
import { SkeletonApps } from '@/components/Skeleton/SkeletonApps/SkeletonApps'

export const SliderAppsNostro = ({ data, isLoading }: ISliderAppsNostro) => {
  const { openApp } = useOpenApp()

  const handleOpenApp = async (app: AppNostroType) => {
    await openApp(app)
  }

  const renderContent = () => {
    if (isLoading && !data.length) {
      return <SkeletonApps />
    }
    if (!data.length && !isLoading) {
      return 'Nothing here'
    }
    return data.map((app, i) => (
      <SwiperSlide className={styles.slide} key={i}>
        <AppNostro app={app} onOpen={handleOpenApp} />
      </SwiperSlide>
    ))
  }

  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {renderContent()}
    </Swiper>
  )
}
