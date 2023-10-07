import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalSignedEventsContent } from './ModalSignedEventsContent'

export const ModalSignedEvents = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.SIGNED_EVENTS_MODAL)

  return (
    <Modal title="Signed events" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalSignedEventsContent />}
    </Modal>
  )
}
