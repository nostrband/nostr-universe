import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalAboutContent } from './ModalAboutContent'

export const ModalAbout = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.ABOUT_MODAL)

  return (
    <Modal title="About app" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalAboutContent />}
    </Modal>
  )
}
