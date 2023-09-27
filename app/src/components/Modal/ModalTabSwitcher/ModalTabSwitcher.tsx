import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { useAppSelector } from '@/store/hooks/redux'
import { selectCurrentWorkspace } from '@/store/store'
import { ModalTabSwitcherContent } from './ModalTabSwitcherContent'

export const ModalTabSwitcher = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TABS_SWITCHER)

  const handleCloseModal = () => {
    if (!currentWorkSpace?.tabIds.length) {
      handleClose('/')
    } else {
      handleClose()
    }
  }

  return (
    <Modal title="Tabs" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalTabSwitcherContent />}
    </Modal>
  )
}
