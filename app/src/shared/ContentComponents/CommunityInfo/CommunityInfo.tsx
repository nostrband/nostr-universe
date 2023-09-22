import { StyledImg, StyledName, StyledPicture, StyledCommunityInfo } from './styled'

export const CommunityInfo = ({
  name,
  picture
}: {
  name: string
  picture: string
}) => {

  return (
    <StyledCommunityInfo>
      <StyledPicture isNotRounded={true}>
        <StyledImg src={picture} />
      </StyledPicture>
      <StyledName>{name}</StyledName>
    </StyledCommunityInfo>
  )
}
