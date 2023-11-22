import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalFeedAppContent } from './ModalFeedAppContent'

export const ModalFeedApp = () => {
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.FEED_MODAL_APPS)

  const handleCloseModal = () => {
    handleClose()
  }

  return (
    <Modal title="New apps" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalFeedAppContent />}
    </Modal>
  )
}
