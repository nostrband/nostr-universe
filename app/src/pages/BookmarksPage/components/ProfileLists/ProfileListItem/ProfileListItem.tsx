import { FC } from 'react'
import { ProfileListItemProps } from './types'
import { StyledContent, StyledProfilesCount, StyledWrapper } from './styled'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { StyledProfileInfo } from '@/shared/ContentComponents/ProfileInfo/styled'
import { StyledProfileName } from '@/shared/Profile/styled'
import { Time } from '@/shared/ContentComponents/Time/Time'

export const ProfileListItem: FC<ProfileListItemProps> = ({
  created_at: time = 0,
  onClick = () => undefined,
  privateProfilePubkeys = [],
  publicProfilePubkeys = [],
  description = '',
  name = ''
}) => {
  const profilesCount = privateProfilePubkeys.length + publicProfilePubkeys.length
  const profileText = profilesCount === 1 ? 'profile' : 'profiles'

  return (
    <StyledWrapper onClick={onClick}>
      <Head>
        <StyledProfileInfo>
          <StyledProfileName>{name}</StyledProfileName>
        </StyledProfileInfo>
        <Time date={time} />
      </Head>
      <StyledProfilesCount>
        {profilesCount} {profileText}
      </StyledProfilesCount>
      {description && (<StyledContent contentLine={1}>{description}</StyledContent>)}
    </StyledWrapper>
  )
}
