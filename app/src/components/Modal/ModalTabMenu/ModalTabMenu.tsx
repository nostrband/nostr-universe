import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalTabMenuContent } from './ModalTabMenuContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalTabMenu = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.TAB_MENU))

  return (
    <Modal title="Tab Menu" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalTabMenuContent handleCloseModal={handleClose} />}
    </Modal>
  )
}
