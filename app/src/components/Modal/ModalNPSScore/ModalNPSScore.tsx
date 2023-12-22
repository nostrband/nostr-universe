import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalNPSScoreContent } from './ModalNPSScoreContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalNPSScore = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.NPS_SCORE_MODAL))

  const modalCloseHandler = () => {
    handleClose()
  }

  return (
    <Modal title="Feedback form" open={isOpen} handleClose={modalCloseHandler}>
      {isOpen && <ModalNPSScoreContent handleClose={modalCloseHandler} />}
    </Modal>
  )
}
