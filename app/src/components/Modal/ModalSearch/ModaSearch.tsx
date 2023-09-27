import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalSearchContent } from './ModalSearchContent'

export const ModalSearch = () => {
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.SEARCH_MODAL)

  return (
    <Modal title="Search" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalSearchContent />}
    </Modal>
  )
}
