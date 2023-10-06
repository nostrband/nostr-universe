import { ListItemButton, ListItemAvatar } from '@mui/material'
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
// import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import TocOutlinedIcon from '@mui/icons-material/TocOutlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined'
// import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { StyledListItemIcon, StyledListItemText, StyledMenuList, StyledMenuWrapper } from './styled'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { ModalPermissions } from '@/components/Modal/ModalPermissions/ModalPermissions'
import { useOpenApp } from '@/hooks/open-entity'
import { checkNsbSigner, reconnect } from '@/modules/nostr'
import { showToast } from '@/utils/helpers/general'
import { useAppSelector } from '@/store/hooks/redux'
import { useState } from 'react'

export const ProfilMenu = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { signEvent } = useOpenApp()
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

  return (
    <>
      <Container>
        <StyledMenuWrapper>
          {/* <StyledMenuTitle variant="body1" component="div">
            Tools
          </StyledMenuTitle> */}
          <StyledMenuList>
            <ListItemButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_MODAL, { append: true })}>
              <ListItemAvatar>
                <StyledListItemIcon>
                  <ChecklistOutlinedIcon />
                </StyledListItemIcon>
              </ListItemAvatar>
              <StyledListItemText primary="Key permissions" />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleOpen(MODAL_PARAMS_KEYS.CONTENT_FEEDS_SETTINGS_MODAL, { append: true })}
            >
              <ListItemAvatar>
                <StyledListItemIcon>
                  <TocOutlinedIcon />
                </StyledListItemIcon>
              </ListItemAvatar>
              <StyledListItemText primary="Content feeds" />
            </ListItemButton>
            {false && (
              <ListItemButton onClick={() => testSignEvent()}>
                <ListItemAvatar>
                  <StyledListItemIcon>
                    <ChecklistOutlinedIcon />
                  </StyledListItemIcon>
                </ListItemAvatar>
                <StyledListItemText primary="Test sign event" />
              </ListItemButton>
            )}
            <ListItemButton onClick={handleReconnect}>
              <ListItemAvatar>
                <StyledListItemIcon>
                  <CachedOutlinedIcon />
                </StyledListItemIcon>
              </ListItemAvatar>
              <StyledListItemText primary="Reconnect relays" />
            </ListItemButton>
            <ListItemButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.SIGNED_EVENTS_MODAL, { append: true })}>
              <ListItemAvatar>
                <StyledListItemIcon>
                  <AssignmentOutlinedIcon />
                </StyledListItemIcon>
              </ListItemAvatar>
              <StyledListItemText primary="Signed events" />
            </ListItemButton>
            {isNsb && (
              <ListItemButton disabled={checkNSB} onClick={handleNsbConnect}>
                <ListItemAvatar>
                  <StyledListItemIcon>
                    <PublishedWithChangesOutlinedIcon />
                  </StyledListItemIcon>
                </ListItemAvatar>
                <StyledListItemText primary="Check NsecBunker" />
              </ListItemButton>
            )}
            {/* <ListItemButton>
            <ListItemAvatar>
              <StyledListItemIcon>
                <StoreOutlinedIcon />
              </StyledListItemIcon>
            </ListItemAvatar>
            <StyledListItemText primary="Key vault" />
          </ListItemButton>
          <ListItemButton>
            <ListItemAvatar>
              <StyledListItemIcon>
                <PeopleAltOutlinedIcon />
              </StyledListItemIcon>
            </ListItemAvatar>
            <StyledListItemText primary="Contacts" />
          </ListItemButton>
          <ListItemButton>
            <ListItemAvatar>
              <StyledListItemIcon>
                <AccountBalanceWalletOutlinedIcon />
              </StyledListItemIcon>
            </ListItemAvatar>
            <StyledListItemText primary="Wallet Connect" />
          </ListItemButton> */}
          </StyledMenuList>
        </StyledMenuWrapper>
        <ModalPermissions />
      </Container>
    </>
  )
}
