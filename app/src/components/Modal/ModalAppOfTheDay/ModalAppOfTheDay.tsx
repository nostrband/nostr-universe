import { Modal } from '@/modules/Modal/Modal'
import { ModalAppOfTheDayContent } from './ModalAppOfTheDayContent'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useAppDispatch } from '@/store/hooks/redux'
import { dbi } from '@/modules/db'
import { setIsShowAOTDWidget } from '@/store/reducers/notifications.slice'

export const ModalAppOfTheDay = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.APP_OF_THE_DAY_MODAL)

  const handleCloseModal = () => {
    handleClose()
    dbi.setAOTDShownDate().then(() => {
      dispatch(setIsShowAOTDWidget({ isShow: false }))
    })
  }

  return (
    <Modal title="App of the Day" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalAppOfTheDayContent handleClose={handleCloseModal} />}
    </Modal>
  )
}
