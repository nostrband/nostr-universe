import { Typography } from '@mui/material'
import { StyledWrapper } from './styled'
import { ITrendingProfiles } from './types'
import { SliderProfiles } from './components/SliderProfiles/SliderProfiles'

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
      <Typography variant="h5" gutterBottom component="div">
        Trending Profiles
      </Typography>

      <SliderProfiles data={dataTrendingProfiles} />
    </StyledWrapper>
  )
}
