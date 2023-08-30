import { StyledImg, StyledName, StyledPicture, StyledProfileInfo } from './styled'

export const ProfileInfo = ({
  picture,
  isNotRounded,
  name
}: {
  picture: string
  name: string
  isNotRounded?: boolean
}) => {
  return (
    <StyledProfileInfo>
      <StyledPicture isNotRounded={isNotRounded}>
        <StyledImg src={picture} />
      </StyledPicture>
      <StyledName>{name}</StyledName>
    </StyledProfileInfo>
  )
}
