import { Button, Container } from '@mui/material'
import { StyledActions, StyledContainer, StyledTitle } from './styled'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { dbi } from '@/modules/db'
import { selectKeys } from '@/store/store'
import { setHideNPSWidget } from '@/store/reducers/feedbackInfo.slice'
import { v4 } from 'uuid'

const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000

export const NPSWidget = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { currentPubkey } = useAppSelector(selectKeys)
  const dispatch = useAppDispatch()

  const delayNPSScoreForWeekHandler = () => {
    const weekAheadTime = Date.now() + sevenDaysInMillis
    const delayedFeedbackInfo = {
      pubkey: currentPubkey || 'GUEST',
      timestamp: weekAheadTime,
      id: v4()
    }
    dbi.delayFeedbackForWeek(delayedFeedbackInfo).then(() => {
      dispatch(setHideNPSWidget())
    })
  }
  return (
    <StyledContainer>
      <Container>
        <Wrapper>
          <StyledTitle>Would you like to provide some feedback?</StyledTitle>
          <StyledActions>
            <Button
              fullWidth
              variant="contained"
              className="button"
              color="actionPrimary"
              onClick={() => handleOpen(MODAL_PARAMS_KEYS.NPS_SCORE_MODAL)}
            >
              Yes
            </Button>
            <Button
              fullWidth
              variant="contained"
              className="button"
              color="actionPrimary"
              onClick={delayNPSScoreForWeekHandler}
            >
              Later
            </Button>
          </StyledActions>
        </Wrapper>
      </Container>
    </StyledContainer>
  )
}
