/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledContainer, StyledDeleteButton, StyledTitle, StyledTitleWrapper } from './styled'
import { Container } from '@/layout/Container/Conatiner'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { dbi } from '@/modules/db'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setIsShowAOTDWidget } from '@/store/reducers/notifications.slice'
import { AppNostroListItem } from '@/shared/AppNostroListItem/AppNostroListItem'

export const AppOfDayWidget = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()
  const { appOfTheDay } = useAppSelector((state) => state.notifications)

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

  if (!appOfTheDay) return null

  return (
    <StyledContainer>
      <Container>
        <Wrapper>
          <StyledTitleWrapper>
            <StyledDeleteButton onClick={handleSkip} />
            <StyledTitle>🎉 App Of The Day</StyledTitle>
          </StyledTitleWrapper>
          <AppNostroListItem app={appOfTheDay} onClick={handleOpenAppOfTheDayModal} />
        </Wrapper>
      </Container>
    </StyledContainer>
  )
}
