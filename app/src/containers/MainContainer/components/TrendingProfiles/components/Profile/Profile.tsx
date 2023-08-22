import AddIcon from '@mui/icons-material/Add'
import { cropName } from '@/utils/helpers/prepare-data'
import { StyledProfile, StyledProfileAvatar, StyledProfileName, StyledProfileAction } from './styled'
import { IProfile } from './types'

export const Profile = ({ profile }: IProfile) => {
  const { name, display_name, npub, picture } = profile
  const getName = cropName(name || display_name || npub, 9)

  return (
    <StyledProfile>
      <StyledProfileAvatar src={picture} />
      <StyledProfileName>{getName}</StyledProfileName>
      <StyledProfileAction color="decorate" size="medium">
        <AddIcon />
      </StyledProfileAction>
    </StyledProfile>
  )
}
