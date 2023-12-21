/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Modal } from '@/modules/Modal/Modal'
import { ModalAppOfTheDayContent } from './ModalAppOfTheDayContent'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { APP_OF_THE_DAY_ID } from '@/modules/AppInitialisation/utils'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalAppOfTheDay = () => {
  const { handleClose } = useOpenModalSearchParams()
  const { isOpen } = useAppSelector((state) => getSlug(state.router.slugs, MODAL_PARAMS_KEYS.APP_OF_THE_DAY_MODAL))

  const hideAOTDWidgetHandler = () => {
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
      {isOpen && <ModalAppOfTheDayContent handleClose={handleClose} handleHideWidget={hideAOTDWidgetHandler} />}
    </Modal>
  )
}
