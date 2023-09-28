import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ProfilMenu } from './components/ProfileMenu/ProfileMenu'
import { ProfileView } from './components/ProfileView/ProfileView'

export const ProfilePage = () => {
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PROFILE_PAGE)

  return (
    <Modal title="My profile" open={isOpen} handleClose={() => handleClose()}>
      {isOpen && (
        <>
          <ProfileView />
          <ProfilMenu />
        </>
      )}
    </Modal>
  )
}
