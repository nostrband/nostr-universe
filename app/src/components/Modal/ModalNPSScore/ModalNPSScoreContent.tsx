import { Container } from '@/layout/Container/Conatiner'
import { NPSScoreForm } from './components/NPSScoreForm/NPSScoreForm'
import { dbi } from '@/modules/db'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { selectKeys } from '@/store/store'
import { FC } from 'react'
import { getFeedbackInfoThunk } from '@/store/reducers/feedbackInfo.slice'

type ModalNPSScoreContentProps = {
  handleClose: () => void
}

export const ModalNPSScoreContent: FC<ModalNPSScoreContentProps> = ({ handleClose }) => {
  const { currentPubkey } = useAppSelector(selectKeys)
  const dispatch = useAppDispatch()

  const submitScoreFormHandler = () => {
    dbi
      .addFeedbackInfo({
        id: uuidv4(),
        pubkey: currentPubkey || 'GUEST',
        timestamp: Date.now()
      })
      .then(() => {
        handleClose()
        dispatch(getFeedbackInfoThunk(currentPubkey))
      })
  }

  return (
    <Container>
      <NPSScoreForm onSubmit={submitScoreFormHandler} />
    </Container>
  )
}
