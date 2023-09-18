import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@mui/material'
import { useOpenApp } from '@/hooks/open-entity'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledButtonContainer, StyledFormControl, StyledInfo, StyledTitle, SwitchControl } from './styled'
import { Container } from '@/layout/Container/Conatiner'

export const ModalPermissionsRequest = () => {
  const { replyCurrentPermRequest } = useOpenApp()
  const [isRemember, setIsRemember] = useState(false)
  const [searchParams] = useSearchParams()
  const { handleClose, getModalOpened } = useOpenModalSearchParams()

  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PERMISSIONS_REQ)
  const currentPermId = searchParams.get('id') || ''
  const { permissionRequests } = useAppSelector((state) => state.permissionRequests)
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)

  const permReq = permissionRequests.find((permReq) => permReq.id === currentPermId)
  const getTab = currentWorkSpace.tabs.find((tab) => tab.id === permReq?.tabId)

  const handleCloseModal = () => {
    handleClose()
    setIsRemember(false)
  }

  const onDisallow = async () => {
    await replyCurrentPermRequest(false, isRemember, currentPermId)
    handleClose()
  }

  const onAllow = async () => {
    await replyCurrentPermRequest(true, isRemember, currentPermId)
    handleClose()
  }

  const prepareLabelAndPayload = () => {
    if (!permReq) {
      return {
        label: '',
        payload: ''
      }
    }

    const { perm, event = {}, paymentRequest = '', wallet = {}, amount = 0, plainText, cipherText } = permReq || {}

    let label = ''
    let payload = null
    if (perm === 'pubkey') {
      label = 'Read your public key'
    } else if (perm?.startsWith('pay_invoice:')) {
      label = `Payment from wallet '${wallet.name}' amount ${amount / 1000} sats:`
      payload = paymentRequest
    } else if (perm?.startsWith('sign:')) {
      const kind = perm?.split(':')[1]
      label = 'Sign event of kind ' + kind + ':'
      payload = JSON.stringify(event, null, 2)
    } else if (perm === 'encrypt') {
      label = 'Encrypt a message:'
      // FIXME add pubkey
      payload = plainText
    } else if (perm === 'decrypt') {
      label = 'Decrypt a message:'
      // FIXME add pubkey
      payload = cipherText
    }
    return { label, payload }
  }

  const { label, payload } = prepareLabelAndPayload()

  return (
    <Modal title="Permission request" open={isOpen} handleClose={handleCloseModal}>
      <Container>
        <StyledInfo>
          <AppIcon size="large" picture={getTab?.icon} alt={getTab?.title} isOutline={false} />
          <StyledTitle variant="h6">{getTab?.title}</StyledTitle>
        </StyledInfo>

        <StyledTitle variant="body1">{label}</StyledTitle>
        {payload && <StyledTitle variant="body2">{payload}</StyledTitle>}
        <StyledFormControl
          control={<SwitchControl checked={isRemember} onChange={(e) => setIsRemember(e.target.checked)} />}
          label="Remember, don't ask again"
        />

        <StyledButtonContainer>
          <Button fullWidth variant="contained" className="button" color="secondary" onClick={onDisallow}>
            Disallow
          </Button>
          <Button fullWidth variant="contained" className="button" color="secondary" onClick={onAllow}>
            Allow
          </Button>
        </StyledButtonContainer>
      </Container>
    </Modal>
  )
}
