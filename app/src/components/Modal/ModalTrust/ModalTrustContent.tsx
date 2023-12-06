import { StyledButton, StyledContainer } from './styled'
import { Box, Stack, Typography } from '@mui/material'
import { LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { ProfileItem } from './components/ProfileItem'
import { useTrustRankings } from './utils/useTrustRankings'
import { useCallback, useMemo } from 'react'
import debounce from 'lodash.debounce'

export const ModalTrustContent = () => {
  const { isLoading, profiles, getTopRankedEvents, setProfiles, isEmpty } = useTrustRankings()

  const handleCalculateEvents = async () => getTopRankedEvents()

  const handleScoreChange = useCallback(
    (pubkey: string, value: number) => {
      setProfiles((currentProfiles) => {
        const updatedProfiles = currentProfiles.map((p) => {
          if (p.pubkey === pubkey) {
            return { ...p, score: value }
          }
          return p
        })
        return updatedProfiles
      })
    },
    [setProfiles]
  )

  const debouncedChangeHandler = useMemo(() => debounce(handleScoreChange, 10), [])

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <LoadingSpinner />
        </Box>
      )
    }

    if (isEmpty) {
      return <Typography textAlign={'center'}>List is empty</Typography>
    }

    return (
      <Stack gap={'0.5rem'}>
        {profiles.map((profile) => (
          <ProfileItem profile={profile} key={profile.pubkey} onScoreChange={debouncedChangeHandler} />
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
