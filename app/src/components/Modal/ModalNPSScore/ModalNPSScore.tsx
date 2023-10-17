import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalNPSScoreContent } from './ModalNPSScoreContent'

export const ModalNPSScore = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.NPS_SCORE_MODAL)

  const modalCloseHandler = () => {
    handleClose()
  }

  return (
    <Modal title="NPS Score" open={isOpen} handleClose={modalCloseHandler}>
      {isOpen && <ModalNPSScoreContent handleClose={modalCloseHandler} />}
    </Modal>
  )
}
