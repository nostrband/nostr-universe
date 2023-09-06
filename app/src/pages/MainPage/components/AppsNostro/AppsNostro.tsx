import { SliderAppsNostro } from './components/SliderAppsNostro/SliderAppsNostro'
import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle } from './styled'
import { useAppSelector } from '@/store/hooks/redux'

export const AppsNostro = () => {
  const { apps, isLoading } = useAppSelector((state) => state.apps)

  return (
    <>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Apps
        </StyledTitle>
      </Container>

      <SliderAppsNostro data={apps} isLoading={isLoading} />
    </>
  )
}
