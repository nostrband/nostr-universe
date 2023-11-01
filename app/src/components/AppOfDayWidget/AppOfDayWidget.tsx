import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledActions, StyledContainer, StyledTitle } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Button } from '@mui/material'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const AppOfDayWidget = () => {
  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenAppOfTheDayModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.APP_OF_THE_DAY_MODAL)
  }

  const handleSkip = () => {}

  return (
    <StyledContainer>
      <Container>
        <Wrapper>
          <StyledTitle>App of the Day</StyledTitle>
          <StyledActions>
            <Button fullWidth variant="contained" className="button" color="actionPrimary" onClick={handleSkip}>
              Skip
            </Button>
            <Button
              fullWidth
              variant="contained"
              className="button"
              color="actionPrimary"
              onClick={handleOpenAppOfTheDayModal}
            >
              Learn more...
            </Button>
          </StyledActions>
        </Wrapper>
      </Container>
    </StyledContainer>
  )
}
