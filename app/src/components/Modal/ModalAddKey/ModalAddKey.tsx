import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalAddKeyContent } from './ModalAddKeyContent'

export const ModalAddKey = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.ADD_KEY_MODAL)

  return (
    <Modal title="Add key" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalAddKeyContent handleClose={handleClose} />}
    </Modal>
  )
}
