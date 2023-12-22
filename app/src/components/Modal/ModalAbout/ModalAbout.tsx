import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalAboutContent } from './ModalAboutContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalAbout = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.ABOUT_MODAL))

  return (
    <Modal title="About Spring" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalAboutContent />}
    </Modal>
  )
}
