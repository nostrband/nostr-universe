import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalPaymentHistoryContent } from './ModalPaymentHistoryContent'

export const ModalPaymentHistory = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PAYMENT_HISTORY_MODAL)

  return (
    <Modal title="Payment history" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalPaymentHistoryContent />}
    </Modal>
  )
}
