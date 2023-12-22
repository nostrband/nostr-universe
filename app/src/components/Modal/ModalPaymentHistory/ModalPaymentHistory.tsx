import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalPaymentHistoryContent } from './ModalPaymentHistoryContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalPaymentHistory = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.PAYMENT_HISTORY_MODAL))

  return (
    <Modal title="Payment history" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalPaymentHistoryContent />}
    </Modal>
  )
}
