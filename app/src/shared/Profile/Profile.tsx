import { getProfileName } from '@/utils/helpers/prepare-data'
import { StyledProfile, StyledProfileAvatar, StyledProfileName, StyledAboutProfile } from './styled'
import { IProfile } from './types'
import { useProfileImageSource } from '@/hooks/profile-image'
import { memo } from 'react'

export const Profile = memo(function Profile({ profile, isContact, onClick = () => {} }: IProfile) {
  const name = getProfileName(profile.pubkey, profile)

  const { url, viewRef } = useProfileImageSource({
    pubkey: profile.pubkey,
    originalImage: profile.profile?.picture
  })

  const about = profile.profile?.about

  return (
    <StyledProfile onClick={() => onClick(profile.pubkey)}>
      <StyledProfileAvatar src={url} ref={viewRef} imgProps={{ loading: 'lazy' }} />
      <StyledProfileName>{name}</StyledProfileName>
      {!isContact && <StyledAboutProfile variant="caption">{about}</StyledAboutProfile>}
    </StyledProfile>
  )
})
