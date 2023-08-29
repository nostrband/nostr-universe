import { cropName } from '@/utils/helpers/prepare-data'
import { StyledProfile, StyledProfileAvatar, StyledProfileName, StyledAboutProfile } from './styled'
import { IProfile } from './types'

export const Profile = ({ profile, isContact, onClick = () => {} }: IProfile) => {
  const { name, display_name, npub, picture, about } = profile
  const getName = cropName(name || display_name || npub, 9)

  return (
    <StyledProfile onClick={() => onClick(profile)}>
      <StyledProfileAvatar src={picture} />
      <StyledProfileName>{getName}</StyledProfileName>
      {!isContact && <StyledAboutProfile variant="caption">{about}</StyledAboutProfile>}
    </StyledProfile>
  )
}
