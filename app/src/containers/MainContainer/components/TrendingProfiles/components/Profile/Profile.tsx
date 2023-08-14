import AddIcon from '@mui/icons-material/Add'
import { StyledProfile, StyledProfileAvatar, StyledProfileName, StyledProfileAction } from './styled'
import { IProfile } from './types'

export const Profile = ({ profile }: IProfile) => {
  return (
    <StyledProfile>
      <StyledProfileAvatar src={profile.img} />
      <StyledProfileName>{profile.name}</StyledProfileName>
      <StyledProfileAction color="decorate" size="medium">
        <AddIcon />
      </StyledProfileAction>
    </StyledProfile>
  )
}
