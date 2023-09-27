import { MetaEvent } from '@/types/meta-event'
import { StyledImg, StyledName, StyledPicture, StyledProfileInfo } from './styled'
import { getProfileName } from '@/utils/helpers/prepare-data'
import { useProfileImageSource } from '@/hooks/profile-image'

export const ProfileInfo = ({
  pubkey,
  profile,
  isNotRounded
}: {
  pubkey: string
  profile?: MetaEvent
  isNotRounded?: boolean
}) => {
  const name = getProfileName(pubkey, profile)

  const { url, viewRef } = useProfileImageSource({
    pubkey: pubkey,
    originalImage: profile?.profile?.picture
  })

  return (
    <StyledProfileInfo>
      <StyledPicture isNotRounded={isNotRounded}>
        <StyledImg loading="lazy" src={url} ref={viewRef} />
      </StyledPicture>
      <StyledName>{name}</StyledName>
    </StyledProfileInfo>
  )
}
