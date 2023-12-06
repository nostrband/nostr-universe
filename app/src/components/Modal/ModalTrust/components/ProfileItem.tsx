import { FC } from 'react'
import { MetaEvent } from '@/types/meta-event'
import { getProfileName } from '@/utils/helpers/prepare-data'
import { useProfileImageSource } from '@/hooks/profile-image'
import { StyledProfile, StyledProfileAvatar, StyledProfileName, StyledScore } from './styled'

type ProfileItemProps = {
  profile: MetaEvent
  score: number
}

const getFixedScore = (score: number) => {
  return score.toFixed(3)
}

export const ProfileItem: FC<ProfileItemProps> = ({ profile, score }) => {
  const name = getProfileName(profile.pubkey, profile)

  const { url, viewRef } = useProfileImageSource({
    pubkey: profile.pubkey,
    originalImage: profile.profile?.picture
  })

  const scoreValue = getFixedScore(score)

  return (
    <StyledProfile>
      <StyledProfileAvatar src={url} ref={viewRef} imgProps={{ loading: 'lazy' }} />
      <StyledProfileName>{name}</StyledProfileName>
      <StyledScore>{scoreValue}</StyledScore>
    </StyledProfile>
  )
}
