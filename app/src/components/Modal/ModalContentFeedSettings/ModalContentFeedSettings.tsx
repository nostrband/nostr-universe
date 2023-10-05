import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalContentFeedSettingsContent } from './ModalContentFeedSettingsContent'

export const ModalContentFeedSettings = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()

  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.CONTENT_FEEDS_SETTINGS_MODAL)

  const handleCloseModal = () => handleClose()

  return (
    <Modal title="Content feeds settings" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalContentFeedSettingsContent handleClose={handleCloseModal} />}
    </Modal>
  )
}
