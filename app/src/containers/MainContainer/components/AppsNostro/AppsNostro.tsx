import { SliderAppsNostro } from './components/SliderAppsNostro/SliderAppsNostro'
import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle } from './styled'
import { useAppSelector } from '@/store/hooks/redux'

export const AppsNostro = () => {
  const { apps, isLoading } = useAppSelector((state) => state.apps)
  const data = apps.map((el) => ({ icon: el.picture, title: el.name }))

  return (
    <>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Apps
        </StyledTitle>
      </Container>

      <SliderAppsNostro data={data} isLoading={isLoading} />
    </>
  )
}
