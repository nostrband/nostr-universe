import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ProfilMenu } from './components/ProfileMenu/ProfileMenu'
import { ProfileView } from './components/ProfileView/ProfileView'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ProfilePage = () => {
  const { handleClose } = useOpenModalSearchParams()
  const isOpen = useAppSelector((state) => getSlug(state, MODAL_PARAMS_KEYS.PROFILE_PAGE))

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
