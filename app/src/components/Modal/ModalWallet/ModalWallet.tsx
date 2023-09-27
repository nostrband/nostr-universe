import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalWalletContent } from './ModalWalletContent'

export const ModalWallet = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.WALLET_MODAL)

  return (
    <Modal title="Wallet" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalWalletContent />}
    </Modal>
  )
}
