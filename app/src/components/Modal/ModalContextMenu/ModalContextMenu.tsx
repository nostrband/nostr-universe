import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalContextMenuContent } from './ModalContextMenuContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalContextMenu = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.CONTEXT_MENU))

  return (
    <Modal title="Magic menu" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalContextMenuContent />}
    </Modal>
  )
}
