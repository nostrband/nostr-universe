import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setApps, setLoading } from '@/store/reducers/apps.slice'
import { fetchApps } from '@/modules/nostr'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { SkeletonApps } from '@/components/Skeleton/SkeletonApps/SkeletonApps'
import { AppNostr } from '@/types/app-nostr'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { useOpenModalSearchParams } from '@/hooks/modal'

export const AppsNostro = memo(function AppsNostro() {
  const { apps, isLoading } = useAppSelector((state) => state.apps)
  const dispatch = useAppDispatch()
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const handleOpenApp = useCallback(
    async (app: AppNostr) => {
      handleOpenContextMenu({ bech32: app.naddr })
    },
    [handleOpenContextMenu]
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
      return (
        <HorizontalSwipeContent>
          <SkeletonApps />
        </HorizontalSwipeContent>
      )
    }

    if (!apps.length && !isLoading) {
      return <EmptyListMessage onReload={handleReloadApps} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const app = apps[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={apps.length}>
          <AppNostro app={app} onOpen={handleOpenApp} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return <HorizontalSwipeVirtualContent itemHeight={105} itemSize={80} itemCount={apps.length} RowComponent={Row} />
  }, [handleOpenApp, apps, isLoading, handleReloadApps])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          New Apps
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
