import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalSignedEventsContent } from './ModalSignedEventsContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalSignedEvents = () => {
  const { handleClose } = useOpenModalSearchParams()
  const { isOpen } = useAppSelector((state) => getSlug(state.router.slugs, MODAL_PARAMS_KEYS.SIGNED_EVENTS_MODAL))

  return (
    <Modal title="Signed events" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalSignedEventsContent />}
    </Modal>
  )
}
