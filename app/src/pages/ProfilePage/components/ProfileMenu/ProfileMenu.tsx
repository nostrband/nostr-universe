import { ListItemButton, ListItemAvatar } from '@mui/material'
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
// import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import PaymentIcon from '@mui/icons-material/Payment'
import TocOutlinedIcon from '@mui/icons-material/TocOutlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { StyledListItemIcon, StyledListItemText, StyledMenuList, StyledMenuWrapper } from './styled'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalPermissions } from '@/components/Modal/ModalPermissions/ModalPermissions'
import { checkNsbSigner, reconnect } from '@/modules/nostr'
import { showToast } from '@/utils/helpers/general'
import { useAppSelector } from '@/store/hooks/redux'
import { useState, useCallback, ReactNode } from 'react'
import { useSigner } from '@/hooks/signer'

export const ProfilMenu = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { signEvent } = useSigner()
  const { currentPubkey, nsbKeys } = useAppSelector((state) => state.keys)
  const [checkNSB, setCheckNSB] = useState(false)

  const testSignEvent = async () => {
    const event = {
      kind: 1,
      created_at: Math.round(Date.now() / 1000),
      content: 'Test',
      tags: []
    }

    try {
      const e = await signEvent(event)
      console.log('NSB signed ok', e)
      showToast(`Signed!`)
    } catch (e) {
      showToast(`Error: ${e}`)
    }
  }

  const handleNsbConnect = async () => {
    if (checkNSB) return
    setCheckNSB(true)
    try {
      await checkNsbSigner()
      showToast('NsecBunker connected!')
    } catch (e) {
      console.log('failed nsb: ', e)
      showToast('Failed to check NsecBunker')
    }
    setCheckNSB(false)
  }

  const handleReconnect = () => {
    reconnect()
  }

  const isNsb = nsbKeys.includes(currentPubkey)

  const renderItem = useCallback((label: string, icon: ReactNode, onClick: () => void) => {
    return (
      <ListItemButton onClick={onClick}>
        <ListItemAvatar>
          <StyledListItemIcon>{icon}</StyledListItemIcon>
        </ListItemAvatar>
        <StyledListItemText primary={label} />
      </ListItemButton>
    )
  }, [])

  return (
    <>
      <Container>
        <StyledMenuWrapper>
          {/* <StyledMenuTitle variant="body1" component="div">
            Tools
          </StyledMenuTitle> */}
          <StyledMenuList>
            {renderItem('Key permissions', <ChecklistOutlinedIcon />, () =>
              handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_MODAL, { append: true })
            )}
            {renderItem('Trust scores', <PeopleAltOutlinedIcon />, () => handleOpen(MODAL_PARAMS_KEYS.TRUST_MODAL))}
            {renderItem('Content feeds', <TocOutlinedIcon />, () =>
              handleOpen(MODAL_PARAMS_KEYS.CONTENT_FEEDS_SETTINGS_MODAL)
            )}
            {false && renderItem('Test sign event', <ChecklistOutlinedIcon />, () => testSignEvent())}
            {false && renderItem('Reconnect relays', <CachedOutlinedIcon />, handleReconnect)}
            {renderItem('Signed events', <AssignmentOutlinedIcon />, () =>
              handleOpen(MODAL_PARAMS_KEYS.SIGNED_EVENTS_MODAL)
            )}
            {renderItem('Payment history', <PaymentIcon />, () => handleOpen(MODAL_PARAMS_KEYS.PAYMENT_HISTORY_MODAL))}
            {isNsb && renderItem('Check NsecBunker', <PublishedWithChangesOutlinedIcon />, handleNsbConnect)}
            {renderItem('Event database', <StorageOutlinedIcon />, () => handleOpen(MODAL_PARAMS_KEYS.SYNC_MODAL))}
          </StyledMenuList>
        </StyledMenuWrapper>
        <ModalPermissions />
      </Container>
    </>
  )
}
