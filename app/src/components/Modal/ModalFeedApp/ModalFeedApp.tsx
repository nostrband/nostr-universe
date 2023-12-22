import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalFeedAppContent } from './ModalFeedAppContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalFeedApp = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.FEED_MODAL_APPS))

  const handleCloseModal = () => {
    handleClose()
  }

  return (
    <Modal title="New apps 555" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalFeedAppContent />}
    </Modal>
  )
}
