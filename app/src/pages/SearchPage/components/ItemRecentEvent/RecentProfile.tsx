import { memo } from 'react'
import { getProfileName } from '@/utils/helpers/prepare-data'
import {
  StyledProfile,
  StyledProfileAvatar,
  StyledProfileName,
  StyledAboutProfile
} from '../../../../shared/Profile/styled'

import { useProfileImageSource } from '@/hooks/profile-image'
import { IRecentProfile } from './types'
import { StyledDeleteButton, StyledQueryTimeInfo } from './styled'

export const RecentProfile = memo(function Profile({
  profile,
  isContact,
  onClick = () => {},
  queryTimeInfo = '',
  onDeleteRecentEvent = () => undefined
}: IRecentProfile) {
  const name = getProfileName(profile.pubkey, profile)

  const { url, viewRef } = useProfileImageSource({
    pubkey: profile.pubkey,
    originalImage: profile.profile?.picture
  })

  const about = profile.profile?.about

  return (
    <StyledProfile onClick={() => onClick(profile)} sx={{ position: 'relative' }}>
      <StyledDeleteButton
        onClick={(e) => {
          e.stopPropagation()
          onDeleteRecentEvent()
        }}
      />
      <StyledProfileAvatar src={url} ref={viewRef} imgProps={{ loading: 'lazy' }} />
      <StyledProfileName>{name}</StyledProfileName>
      {!isContact && <StyledAboutProfile variant="caption">{about}</StyledAboutProfile>}
      {queryTimeInfo && <StyledQueryTimeInfo sx={{ margin: 0 }}>{queryTimeInfo}</StyledQueryTimeInfo>}
    </StyledProfile>
  )
})
