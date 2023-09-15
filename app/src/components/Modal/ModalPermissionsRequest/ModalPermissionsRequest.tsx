import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
// import { useSearchParams } from 'react-router-dom'
// import { useAppSelector } from '@/store/hooks/redux'
import { useState } from 'react'
import { Switch, FormControlLabel } from '@mui/material'
import { useOpenApp } from '@/hooks/open-entity'

export const ModalPermissionsRequest = () => {
  const { replyCurrentPermRequest } = useOpenApp()
  const [isRemember, setIsRemember] = useState(false)
  // const [searchParams] = useSearchParams()
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  // const { permissions } = useAppSelector((state) => state.permissions)
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PERMISSIONS_REQ)
  // const id = searchParams.get('id') || ''

  const handleCloseModal = () => {
    handleClose()
  }

  const onDisallow = async () => {
    await replyCurrentPermRequest(false, isRemember)
    handleClose()
  }

  const onAllow = async () => {
    await replyCurrentPermRequest(true, isRemember)
    handleClose()
  }

  return (
    <Modal title="Permissions req" open={isOpen} handleClose={handleCloseModal}>
      <FormControlLabel
        control={<Switch checked={isRemember} onChange={(e) => setIsRemember(e.target.checked)} />}
        label="Remember, don't ask again"
        className="form_control"
      />

      <button onClick={onDisallow}>Disallow</button>
      <button onClick={onAllow}>Allow</button>
    </Modal>
  )
}
