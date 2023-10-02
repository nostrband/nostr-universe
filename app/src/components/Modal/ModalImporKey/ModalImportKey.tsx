import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalImportKeyContent } from './ModalImportKeyContent'
import { useCallback } from 'react'

export const ModalImportKey = () => {
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.KEY_IMPORT)

  const handleCloseModal = useCallback(() => {
    handleClose()
  }, [handleClose])

  return (
    <Modal title="Add read-only keys" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalImportKeyContent handleCloseModal={handleCloseModal} />}
    </Modal>
  )
}
