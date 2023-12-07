import { Modal } from '@/modules/Modal/Modal'
import { ModalTrustContent } from './ModalTrustContent'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const ModalTrust = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TRUST_MODAL)

  return (
    <Modal open={isOpen} title="Trust scores" handleClose={() => handleClose()}>
      {isOpen && <ModalTrustContent />}
    </Modal>
  )
}
