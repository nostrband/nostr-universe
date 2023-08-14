import { IAppsNostro } from './types'
import { SliderAppsNostro } from './components/SliderAppsNostro/SliderAppsNostro'
import { Container } from '../../../../layout/Container/Conatiner'
import { StyledTitle } from './styled'

const dataTrendingProfiles: IAppsNostro = [
  {
    name: 'Cygnus',
    img: 'https://i.pravatar.cc/150?img=7'
  },
  {
    name: 'Eclipse',
    img: 'https://i.pravatar.cc/150?img=7'
  },
  {
    name: 'Chrono',
    img: 'https://i.pravatar.cc/150?img=7'
  },
  {
    name: 'Helix',
    img: 'https://i.pravatar.cc/150?img=7'
  },
  {
    name: 'Omega',
    img: 'https://i.pravatar.cc/150?img=7'
  }
]

export const AppsNostro = () => {
  return (
    <>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Apps
        </StyledTitle>
      </Container>

      <SliderAppsNostro data={dataTrendingProfiles} />
    </>
  )
}
