import { SliderProfiles } from './components/SliderProfiles/SliderProfiles'
import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { userService } from '@/store/services/user.service'

export const TrendingProfiles = () => {
  const { data, isLoading } = userService.useFetchTrendingProfilesQuery('')

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Trending Profiles
        </StyledTitle>
      </Container>

      <SliderProfiles data={data} isLoading={isLoading} />
    </StyledWrapper>
  )
}
