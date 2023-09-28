import { Container } from '@/layout/Container/Conatiner'
import { Button } from '@mui/material'
import { StyledActions, StyledContainer, StyledSubTitle, StyledTitle } from './styled'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenApp } from '@/hooks/open-entity'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const WelcomeWidget = () => {
  const { keys } = useAppSelector((state) => state.keys)
  const { onImportKey } = useOpenApp()
  const { handleOpen } = useOpenModalSearchParams()

  if (keys.length) {
    return null
  }

  const handleOpenImportKeys = () => {
    handleOpen(MODAL_PARAMS_KEYS.KEY_IMPORT)
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
              Login with npub
            </Button>
            <Button
              fullWidth
              variant="contained"
              className="button"
              color="actionPrimary"
              onClick={() => onImportKey()}
            >
              Add keys
            </Button>
          </StyledActions>
        </Wrapper>
      </Container>
    </StyledContainer>
  )
}
