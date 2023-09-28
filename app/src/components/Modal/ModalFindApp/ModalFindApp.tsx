import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalFindAppContent } from './ModalFindAppContent'

export const ModalFindApp = () => {
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.FIND_APP)

  const handleCloseModal = () => {
    handleClose()
  }

  return (
    <Modal title="Find app" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalFindAppContent handleClose={handleCloseModal} />}
    </Modal>
  )
}
