import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalContextMenuContent } from './ModalContextMenuContent'

export const ModalContextMenu = () => {
  const { getModalOpened, handleClose, getModalOrder } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.CONTEXT_MENU)
  const order = getModalOrder(MODAL_PARAMS_KEYS.CONTEXT_MENU)

  return (
    <Modal title="Magic menu" open={isOpen} zIndex={order} handleClose={() => handleClose()}>
      {isOpen && <ModalContextMenuContent />}
    </Modal>
  )
}
