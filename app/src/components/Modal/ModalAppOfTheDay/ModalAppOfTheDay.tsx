/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Modal } from '@/modules/Modal/Modal'
import { ModalAppOfTheDayContent } from './ModalAppOfTheDayContent'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useAppDispatch } from '@/store/hooks/redux'
import { dbi } from '@/modules/db'
import { setIsShowAOTDWidget } from '@/store/reducers/notifications.slice'
import { APP_OF_THE_DAY_ID } from '@/modules/AppInitialisation/utils'

export const ModalAppOfTheDay = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.APP_OF_THE_DAY_MODAL)

  const hideAOTDWidgetHandler = () => {
    dbi.setAOTDShownDate().then(() => {
      dispatch(setIsShowAOTDWidget({ isShow: false }))
    })
    // @ts-ignore
    if (window.cordova) {
      // @ts-ignore
      window.cordova.plugins.notification.local.cancel(APP_OF_THE_DAY_ID, function () {
        console.log('App of the day widget was skipped!')
      })
    }
  }

  const handleCloseModal = () => {
    handleClose()
    hideAOTDWidgetHandler()
  }

  return (
    <Modal title="App of the Day" open={isOpen} handleClose={handleCloseModal}>
      {isOpen && <ModalAppOfTheDayContent handleClose={handleCloseModal} handleHideWidget={hideAOTDWidgetHandler} />}
    </Modal>
  )
}
