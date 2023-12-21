import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalPermissionsRequestContent } from './ModalPermissionsRequestContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalPermissionsRequest = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.PERMISSIONS_REQ))

  // NOTE: always render the content, it must work even
  // if !isOpen
  return (
    <Modal title="Permission request" open={isOpen} handleClose={() => handleClose()}>
      <ModalPermissionsRequestContent isOpen={isOpen} handleCloseModal={handleClose} />
    </Modal>
  )
}
