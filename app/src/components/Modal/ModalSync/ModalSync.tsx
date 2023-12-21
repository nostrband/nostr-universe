import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalSyncContent } from './ModalSyncContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalSync = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.SYNC_MODAL))

  return (
    <Modal title="Sync with relays" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalSyncContent />}
    </Modal>
  )
}
