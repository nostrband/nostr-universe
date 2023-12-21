import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalWalletContent } from './ModalWalletContent'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalWallet = () => {
  const { handleClose } = useOpenModalSearchParams()
  const { isOpen, order } = useAppSelector((state) => getSlug(state.router.slugs, MODAL_PARAMS_KEYS.WALLET_MODAL))

  return (
    <Modal title="Wallet" open={isOpen} zIndex={order} handleClose={() => handleClose()}>
      {isOpen && <ModalWalletContent />}
    </Modal>
  )
}
