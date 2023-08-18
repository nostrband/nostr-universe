import { IAppsNostro } from './types'
import { SliderAppsNostro } from './components/SliderAppsNostro/SliderAppsNostro'
import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle } from './styled'

const dataTrendingProfiles: IAppsNostro = [
  {
    name: 'Cygnus',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Eclipse',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Chrono',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Helix',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
  },
  {
    name: 'Omega',
    img: 'https://miro.medium.com/v2/resize:fit:956/1*BoIwK3flsWLkT57s18Bpgg.png'
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
