import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalFindAppContent } from './ModalFindAppContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalFindApp = () => {
  const { handleClose } = useOpenModalSearchParams()
  const { isOpen } = useAppSelector((state) => getSlug(state.router.slugs, MODAL_PARAMS_KEYS.FIND_APP))

  const handleCloseModal = () => {
    handleClose()
  }

  return (
    <Modal title="Find app" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalFindAppContent handleClose={handleCloseModal} />}
    </Modal>
  )
}
