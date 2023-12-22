import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalAddNSBKeyContent } from './ModalAddNSBKeyContent'
import { useCallback } from 'react'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalAddNSBKey = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.ADD_NSB_KEY_MODAL))

  const handleCloseModal = useCallback(() => {
    handleClose()
  }, [handleClose])

  return (
    <Modal title="Add nsecBunker key" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalAddNSBKeyContent handleCloseModal={handleCloseModal} />}
    </Modal>
  )
}
