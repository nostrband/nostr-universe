import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalImportKeyContent } from './ModalImportKeyContent'
import { useCallback } from 'react'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalImportKey = () => {
  const { handleClose } = useOpenModalSearchParams()
  // const isOpen = getModalOpened(MODAL_PARAMS_KEYS.KEY_IMPORT)
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.KEY_IMPORT))

  const handleCloseModal = useCallback(() => {
    handleClose()
  }, [handleClose])

  return (
    <Modal title="Add read-only keys" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalImportKeyContent handleCloseModal={handleCloseModal} />}
    </Modal>
  )
}
