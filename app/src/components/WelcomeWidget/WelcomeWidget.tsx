import { Container } from '@/layout/Container/Conatiner'
import { Button } from '@mui/material'
import { StyledActions, StyledContainer, StyledSubTitle, StyledTitle } from './styled'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const WelcomeWidget = () => {
  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenImportKeys = () => {
    handleOpen(MODAL_PARAMS_KEYS.ADD_KEY_MODAL)
  }

  return (
    <StyledContainer>
      <Container>
        <StyledTitle>Welcome, Guest!</StyledTitle>

        <Wrapper>
          <StyledSubTitle>This app works best if you log in.</StyledSubTitle>
          <StyledActions>
            <Button
              fullWidth
              variant="contained"
              className="button"
              color="actionPrimary"
              onClick={handleOpenImportKeys}
            >
              Add keys
            </Button>
          </StyledActions>
        </Wrapper>
      </Container>
    </StyledContainer>
  )
}
