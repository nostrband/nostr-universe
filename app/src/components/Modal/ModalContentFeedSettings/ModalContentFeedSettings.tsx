import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalContentFeedSettingsContent } from './ModalContentFeedSettingsContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalContentFeedSettings = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.CONTENT_FEEDS_SETTINGS_MODAL))

  const handleCloseModal = () => handleClose()

  return (
    <Modal title="Content feeds settings" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalContentFeedSettingsContent handleClose={handleCloseModal} />}
    </Modal>
  )
}
