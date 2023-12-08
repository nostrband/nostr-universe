import { FC } from 'react'
import { MetaEvent } from '@/types/meta-event'
import { getProfileName } from '@/utils/helpers/prepare-data'
import { useProfileImageSource } from '@/hooks/profile-image'
import { StyledProfile, StyledProfileAvatar, StyledProfileName, StyledScore, StyledSlider } from './styled'
import { Box, Stack, Typography } from '@mui/material'
import { getFixedScore, getScoreLabel } from './helpers'

type ProfileItemProps = {
  profile: MetaEvent & { score: number }

  onScoreChange: (pubkey: string, value: number) => void
}

export const ProfileItem: FC<ProfileItemProps> = ({ profile, onScoreChange }) => {
  const name = getProfileName(profile.pubkey, profile)

  const { url, viewRef } = useProfileImageSource({
    pubkey: profile.pubkey,
    originalImage: profile.profile?.picture
  })

  const scoreValue = getFixedScore(profile.score)
  const scoreLabel = getScoreLabel(profile.score)

  return (
    <StyledProfile>
      <Stack gap={'1rem'} alignItems={'center'} direction={'row'}>
        <StyledProfileAvatar src={url} ref={viewRef} imgProps={{ loading: 'lazy' }} />
        <Box marginTop={'0.25rem'} flexGrow={'1'}>
          <StyledProfileName>{name}</StyledProfileName>
        </Box>
        <Box marginTop={'0.25rem'}>
          <Typography>{scoreLabel}</Typography>
        </Box>
      </Stack>
      <Stack gap={'1rem'} alignItems={'center'} direction={'row'}>
        <StyledSlider
          value={profile.score}
          onChange={(_, value) => onScoreChange(profile.pubkey, Array.isArray(value) ? value[0] : value)}
        />
        <StyledScore>{scoreValue}</StyledScore>
      </Stack>
    </StyledProfile>
  )
}
