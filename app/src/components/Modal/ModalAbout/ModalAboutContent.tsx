import { Container } from '@/layout/Container/Conatiner'
import { StyledViewTitle, StyledWrap } from './styled'
import { AppLogo } from '@/assets'
import { AppIcon } from '@/shared/AppIcon/AppIcon'

export const ModalAboutContent = () => {
  return (
    <Container>
      <StyledWrap>
        <AppIcon size="big" isOutline={false} picture={AppLogo} />
        <StyledViewTitle variant="h5">The Nostr Browser</StyledViewTitle>
        <StyledViewTitle variant="body1">0.2.0</StyledViewTitle>
      </StyledWrap>
    </Container>
  )
}
