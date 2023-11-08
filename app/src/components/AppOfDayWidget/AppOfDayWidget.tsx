/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledActions, StyledContainer, StyledTitle } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Button } from '@mui/material'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { dbi } from '@/modules/db'
import { useAppDispatch } from '@/store/hooks/redux'
import { setIsShowAOTDWidget } from '@/store/reducers/notifications.slice'

export const AppOfDayWidget = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenAppOfTheDayModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.APP_OF_THE_DAY_MODAL)
  }

  const handleSkip = () => {
    dbi.setAOTDShownDate().then(() => {
      dispatch(setIsShowAOTDWidget({ isShow: false }))
    })
    // @ts-ignore
    if (window.cordova) {
      // @ts-ignore
      window.cordova.plugins.notification.local.cancel(APP_OF_THE_DAY_ID, function () {
        console.log('App of the day widget was skipped!')
      })
    }
  }

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
