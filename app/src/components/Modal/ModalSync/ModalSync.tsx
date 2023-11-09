import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalSyncContent } from './ModalSyncContent'

export const ModalSync = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.SYNC_MODAL)

  return (
    <Modal title="Sync with relays" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalSyncContent />}
    </Modal>
  )
}
