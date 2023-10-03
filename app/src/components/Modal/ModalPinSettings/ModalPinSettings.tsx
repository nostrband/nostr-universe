import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalPinSettingsContent } from './ModalPinSettingsContent'

export const ModalPinSettings = () => {
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PIN_SETTINGS_MODAL)

  return (
    <Modal title="App settings" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalPinSettingsContent handleClose={handleClose} />}
    </Modal>
  )
}
