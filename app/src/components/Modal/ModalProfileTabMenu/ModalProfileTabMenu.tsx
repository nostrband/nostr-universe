import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalProfileTabMenuContent } from './ModalProfileTabMenuContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalProfileTabMenu = () => {
  const { handleClose } = useOpenModalSearchParams()
  const { isOpen, slug } = useAppSelector((state) =>
    getSlug(state.router.slugs, MODAL_PARAMS_KEYS.PROFILE_TAB_MENU_MODAL)
  )

  return (
    <Modal title="App permissions" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalProfileTabMenuContent slug={slug} />}
    </Modal>
  )
}
