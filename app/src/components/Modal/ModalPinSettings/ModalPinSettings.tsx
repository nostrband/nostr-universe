import { useOpenModalSearchParams } from '@/hooks/modal'
import { Modal } from '@/modules/Modal/Modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalPinSettingsContent } from './ModalPinSettingsContent'
import { useState } from 'react'

export const ModalPinSettings = () => {
  const [appTitle, setAppTitle] = useState('')
  const { handleClose, getModalOpened } = useOpenModalSearchParams()

  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PIN_SETTINGS_MODAL)

  const handleSetAppTitle = (title: string) => setAppTitle(title)

  return (
    <Modal title={`${appTitle ? `«${appTitle}»` : 'App'} settings`} open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalPinSettingsContent handleClose={() => handleClose()} handleSetAppTitle={handleSetAppTitle} />}
    </Modal>
  )
}
