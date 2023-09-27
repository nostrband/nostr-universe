import { SliderAppsNostro } from './components/SliderAppsNostro/SliderAppsNostro'
import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle } from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setApps, setLoading } from '@/store/reducers/apps.slice'
import { fetchApps } from '@/modules/nostr'
import { memo, useCallback } from 'react'

export const AppsNostro = memo(() => {
  const { apps, isLoading } = useAppSelector((state) => state.apps)
  const dispatch = useAppDispatch()

  const handleReloadApps = useCallback(async () => {
    dispatch(setLoading({ isLoading: true }))
    const apps = await fetchApps().finally(() => {
      dispatch(setLoading({ isLoading: false }))
    })
    dispatch(setApps({ apps }))
  }, [dispatch])

  return (
    <>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Apps
        </StyledTitle>
      </Container>

      <SliderAppsNostro data={apps} isLoading={isLoading} handleReloadEntity={handleReloadApps} />
    </>
  )
})
