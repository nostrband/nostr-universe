import { Modal } from '@/modules/Modal/Modal'
import { ModalAppOfTheDayContent } from './ModalAppOfTheDayContent'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'

export const ModalAppOfTheDay = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()

  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.APP_OF_THE_DAY_MODAL)

  const handleCloseModal = () => handleClose()
  return (
    <Modal title="App of the Day" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalAppOfTheDayContent handleClose={handleCloseModal} />}
    </Modal>
  )
}
