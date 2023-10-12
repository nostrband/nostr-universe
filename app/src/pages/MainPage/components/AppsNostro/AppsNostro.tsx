import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setApps, setLoading } from '@/store/reducers/apps.slice'
import { fetchApps } from '@/modules/nostr'
import { memo, useCallback } from 'react'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { SkeletonApps } from '@/components/Skeleton/SkeletonApps/SkeletonApps'
import { AppNostr } from '@/types/app-nostr'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const AppsNostro = memo(function AppsNostro() {
  const { apps, isLoading } = useAppSelector((state) => state.apps)
  const dispatch = useAppDispatch()
  const { handleOpen } = useOpenModalSearchParams()

//  const { openApp } = useOpenApp()

  const handleOpenApp = useCallback(
    async (app: AppNostr) => {
      handleOpen(MODAL_PARAMS_KEYS.CONTEXT_MENU, {
        search: {
          bech32: app.naddr || ''
        }
      })
    },
    [handleOpen] 
  )

  const handleReloadApps = useCallback(async () => {
    dispatch(setLoading({ isLoading: true }))
    const apps = await fetchApps().finally(() => {
      dispatch(setLoading({ isLoading: false }))
    })
    dispatch(setApps({ apps }))
  }, [dispatch])

  const renderContent = useCallback(() => {
    if (isLoading && !apps.length) {
      return <SkeletonApps />
    }
    if (!apps.length && !isLoading) {
      return <EmptyListMessage onReload={handleReloadApps} />
    }
    return apps.map((app, i) => <AppNostro key={i} app={app} onOpen={handleOpenApp} />)
  }, [handleOpenApp, apps, isLoading, handleReloadApps])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Apps
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
