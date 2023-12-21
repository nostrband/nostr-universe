import { Modal } from '@/modules/Modal/Modal'
import { ModalTrustContent } from './ModalTrustContent'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalTrust = () => {
  const { handleClose } = useOpenModalSearchParams()
  const { isOpen } = useAppSelector((state) => getSlug(state.router.slugs, MODAL_PARAMS_KEYS.TRUST_MODAL))

  return (
    <Modal open={isOpen} title="Trust scores" handleClose={() => handleClose()}>
      {isOpen && <ModalTrustContent />}
    </Modal>
  )
}
