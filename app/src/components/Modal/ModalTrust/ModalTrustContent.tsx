import { StyledButton, StyledContainer } from './styled'
import { Box, Stack } from '@mui/material'
import { LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { ProfileItem } from './components/ProfileItem'
import { useTrustRankings } from './utils/useTrustRankings'

export const ModalTrustContent = () => {
  const { isLoading, profiles, getTopRankedEvents } = useTrustRankings()

  const handleCalculateEvents = async () => getTopRankedEvents()

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <LoadingSpinner />
        </Box>
      )
    }

    return (
      <Stack gap={'0.5rem'}>
        {profiles.map((profile) => (
          <ProfileItem profile={profile} key={profile.pubkey} score={profile.score} />
        ))}
      </Stack>
    )
  }

  return (
    <StyledContainer>
      <Stack alignItems={'center'} marginBottom={'1rem'}>
        <StyledButton onClick={handleCalculateEvents}>Calculate</StyledButton>
      </Stack>
      {renderContent()}
    </StyledContainer>
  )
}
