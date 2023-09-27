import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { AppNostr as AppNostroType } from '@/types/app-nostr'
import { useOpenApp } from '@/hooks/open-entity'
import { ISliderAppsNostro } from './types'
import styles from './slider.module.scss'
import 'swiper/css'
import { SkeletonApps } from '@/components/Skeleton/SkeletonApps/SkeletonApps'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { memo, useCallback } from 'react'

export const SliderAppsNostro = memo(({ data, isLoading, handleReloadEntity = () => {} }
: ISliderAppsNostro) => {
  const { openApp } = useOpenApp()

  const handleOpenApp = useCallback(async (app: AppNostroType) => {
    await openApp(app)
  }, [openApp])

  const renderContent = useCallback(() => {
    if (isLoading && !data.length) {
      return <SkeletonApps />
    }
    if (!data.length && !isLoading) {
      return <EmptyListMessage onReload={handleReloadEntity} />
    }
    return data.map((app, i) => (
      <SwiperSlide className={styles.slide} key={i}>
        <AppNostro app={app} onOpen={handleOpenApp} />
      </SwiperSlide>
    ))
  }, [handleOpenApp, data, isLoading, handleReloadEntity])

  return (
    <Swiper slidesPerView="auto" freeMode={true} modules={[FreeMode]}>
      {renderContent()}
    </Swiper>
  )
})
