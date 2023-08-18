/* eslint-disable */
// @ts-nocheck
import { useContext } from 'react'
import { ITrendingProfiles } from './types'
import { SliderProfiles } from './components/SliderProfiles/SliderProfiles'
import { Container } from '../../../../layout/Container/Conatiner'
import { AppContext } from '../../../../store/app-context'
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
  const contextData = useContext(AppContext)
  const { currentWorkspace, onOpenEvent } = contextData || {}

  const trendingProfiles = currentWorkspace?.trendingProfiles || []

  console.log(trendingProfiles)

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
