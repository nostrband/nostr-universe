import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalProfileTabMenuContent } from './ModalProfileTabMenuContent'

export const ModalProfileTabMenu = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PROFILE_TAB_MENU_MODAL)

  return (
    <Modal title="App permissions" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalProfileTabMenuContent />}
    </Modal>
  )
}
