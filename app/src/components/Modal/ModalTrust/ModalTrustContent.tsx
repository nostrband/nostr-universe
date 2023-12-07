import { StyledButton, StyledContainer } from './styled'
import { Box, Stack, Typography } from '@mui/material'
import { LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { ProfileItem } from './components/ProfileItem'
import { useTrustRankings } from './utils/useTrustRankings'
import { useCallback, useMemo } from 'react'
import debounce from 'lodash.debounce'
import { showToast } from '@/utils/helpers/general'
import { useSigner } from '@/hooks/signer'
import { publishTrustScores } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'

export const ModalTrustContent = () => {
  const { isLoading, profiles, getTopRankedEvents, setProfiles, isEmpty } = useTrustRankings()
  const { signEvent } = useSigner()
  const { currentPubkey } = useAppSelector((state) => state.keys)

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

  const publishTrustAssignments = useCallback(async () => {
    await publishTrustScores(signEvent, currentPubkey, profiles)
    showToast('Published!')
  }, [currentPubkey, signEvent, profiles])

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
      <Typography marginBottom={'1rem'}>
        Estimate trust scores from your past interactions.
        You can adjust them and publish. Trust scores may be
        used for decentralized algorithms.
      </Typography>
      <Stack alignItems={'center'} marginBottom={'1rem'} direction={'row'} gap={'1rem'}>
        <StyledButton onClick={handleCalculateEvents}>Estimate</StyledButton>
        <StyledButton onClick={publishTrustAssignments} disabled={profiles.length === 0}>Publish</StyledButton>
      </Stack>
      {renderContent()}
    </StyledContainer>
  )
}
