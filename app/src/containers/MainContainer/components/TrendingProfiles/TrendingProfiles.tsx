import { ITrendingProfiles } from './types'
import { SliderProfiles } from './components/SliderProfiles/SliderProfiles'
import { Container } from '../../../../layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'

const dataTrendingProfiles: ITrendingProfiles = [
  {
    name: 'Cygnus-21',
    img: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Eclipse-47',
    img: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Chronotro...',
    img: 'https://i.pravatar.cc/150?img=4'
  },
  {
    name: 'Helix-27',
    img: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'Omega-50',
    img: 'https://i.pravatar.cc/150?img=6'
  }
]

export const TrendingProfiles = () => {
  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Profiles
        </StyledTitle>
      </Container>

      <SliderProfiles data={dataTrendingProfiles} />
    </StyledWrapper>
  )
}
