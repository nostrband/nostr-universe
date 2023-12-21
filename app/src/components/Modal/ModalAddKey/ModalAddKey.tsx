import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalAddKeyContent } from './ModalAddKeyContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalAddKey = () => {
  const { handleClose } = useOpenModalSearchParams()
  const { isOpen } = useAppSelector((state) => getSlug(state.router.slugs, MODAL_PARAMS_KEYS.ADD_KEY_MODAL))

  return (
    <Modal title="Add key" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalAddKeyContent handleClose={handleClose} />}
    </Modal>
  )
}
