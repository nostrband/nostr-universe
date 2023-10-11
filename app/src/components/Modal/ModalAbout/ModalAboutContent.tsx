import { Typography } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { StyledViewTitle, StyledWrap } from './styled'
import { AppLogo } from '@/assets'
import { AppIcon } from '@/shared/AppIcon/AppIcon'

export const ModalAboutContent = () => {
  return (
    <Container>
      <StyledWrap>
        <AppIcon isLight size="big" isOutline={false} picture={AppLogo} />
        <StyledViewTitle variant="h5">The Nostr Browser</StyledViewTitle>
        <StyledViewTitle variant="body1">0.3.1</StyledViewTitle>
        <Typography variant="body1">Spring is an open-source project by Nostr.Band.</Typography>
      </StyledWrap>
    </Container>
  )
}
