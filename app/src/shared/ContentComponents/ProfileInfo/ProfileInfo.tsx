import { MetaEvent } from '@/types/meta-event'
import { StyledName, StyledProfileAvatar, StyledProfileInfo } from './styled'
import { getProfileName } from '@/utils/helpers/prepare-data'
import { useProfileImageSource } from '@/hooks/profile-image'

export const ProfileInfo = ({ pubkey, profile }: { pubkey: string; profile?: MetaEvent }) => {
  const name = getProfileName(pubkey, profile)

  const { url, viewRef } = useProfileImageSource({
    pubkey: pubkey,
    originalImage: profile?.profile?.picture
  })

  return (
    <StyledProfileInfo>
      <StyledProfileAvatar src={url} ref={viewRef} imgProps={{ loading: 'lazy' }} />
      <StyledName>{name}</StyledName>
    </StyledProfileInfo>
  )
}
