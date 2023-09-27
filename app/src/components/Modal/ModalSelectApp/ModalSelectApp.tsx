import { useState } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalSelectAppContent } from './ModalSelectAppContent'

export const ModalSelectApp = () => {
  const [kind, setKind] = useState('')
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.SELECT_APP)

  const handleSetKind = (k: string) => {
    setKind(k)
  }

  return (
    <Modal title={kind ? `Select app for kind ${kind}` : `Select app`} open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalSelectAppContent handleSetKind={handleSetKind} />}
    </Modal>
  )
}
