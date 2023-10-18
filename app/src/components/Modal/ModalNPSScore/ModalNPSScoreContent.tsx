import { Container } from '@/layout/Container/Conatiner'
import { NPSScoreForm } from './components/NPSScoreForm/NPSScoreForm'
import { dbi } from '@/modules/db'
import { useAppDispatch } from '@/store/hooks/redux'
import { FC } from 'react'
import { getFeedbackInfoThunk } from '@/store/reducers/feedbackInfo.slice'
import { showToast } from '@/utils/helpers/general'
import { useFeedback } from '@/hooks/feedback'

type ModalNPSScoreContentProps = {
  handleClose: () => void
}

export const ModalNPSScoreContent: FC<ModalNPSScoreContentProps> = ({ handleClose }) => {
  const dispatch = useAppDispatch()
  const { sendFeedback } = useFeedback()

  const submitScoreFormHandler = async (data: any) => {
    console.log("feedback", data)

    handleClose()

    try {
      showToast('Thank you!')
      await sendFeedback(data)

      await dbi.advanceFeedbackTime()
      dispatch(getFeedbackInfoThunk())

    } catch (e) {
      console.log("Failed ", e)
      showToast('Failed to send feedback!')
    }
  }

  return (
    <Container>
      <NPSScoreForm onSubmit={submitScoreFormHandler} />
    </Container>
  )
}
