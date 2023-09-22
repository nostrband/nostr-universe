import { useOpenModalSearchParams } from '@/hooks/modal'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import { StyledInfoItem, StyledItemButton, StyledItemIconAvatar, StyledItemText, StyledList } from './styled'
import { ListItem, ListItemAvatar } from '@mui/material'
import { useOpenApp } from '@/hooks/open-entity'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { stringToBech32 } from '@/modules/nostr'

export const ModaTabMenu = () => {
  const [searchParams] = useSearchParams()
  const { onCloseTab, openZap } = useOpenApp()
  const { getModalOpened, handleClose, handleOpen } = useOpenModalSearchParams()
  const [eventAddr, setEventAddr] = useState('')
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TAB_MENU)
  const id = searchParams.get('tabId') || ''

  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const currentWorkSpace = workspaces.find((workspace) => workspace.pubkey === currentPubKey)
  const currentTab = currentWorkSpace?.tabs.find((tab) => tab.id === id)

  const isPin = currentWorkSpace?.pins.find((pin) => pin.appNaddr === currentTab?.appNaddr)
  const url = currentTab?.url

  useEffect(() => {
    if (url) {
      const addr = stringToBech32(url)
      setEventAddr(addr)
    } else {
      setEventAddr('')
    }
  }, [url])

  const handleCloseTab = () => {
    handleClose('/')
    onCloseTab(id)
  }

  const handlePinUnPinTab = () => {
    // ????? diferent id in pins
    if (isPin) {
      console.log('unpin')
    } else {
      console.log('pin')
    }
  }

  const handleOpenModalSelect = () => {
    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: eventAddr } })
  }

  const handleZap = async () => {
    if (!url) return
    const addr = stringToBech32(url)
    //    const event = await fetchEventByBech32(addr)
    openZap(addr)
  }

  return (
    <Modal title="Tab Menu (WIP)" open={isOpen} handleClose={() => handleClose()}>
      <Container>
        <StyledInfoItem>URL: {url}</StyledInfoItem>
        <StyledInfoItem>App: {currentTab?.title}</StyledInfoItem>

        <StyledList>
          <ListItem disablePadding>
            <StyledItemButton alignItems="center" onClick={handleCloseTab}>
              <ListItemAvatar>
                <StyledItemIconAvatar>
                  <CloseOutlinedIcon />
                </StyledItemIconAvatar>
              </ListItemAvatar>
              <StyledItemText primary="Close tab" />
            </StyledItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledItemButton alignItems="center" onClick={handlePinUnPinTab}>
              <ListItemAvatar>
                <StyledItemIconAvatar>
                  {isPin ? <DeleteOutlineOutlinedIcon /> : <PushPinOutlinedIcon />}
                </StyledItemIconAvatar>
              </ListItemAvatar>
              <StyledItemText primary={isPin ? "Unpin" : "Pin"} />
            </StyledItemButton>
          </ListItem>
          {eventAddr && (
            <>
              <ListItem disablePadding>
                <StyledItemButton alignItems="center" onClick={handleOpenModalSelect}>
                  <ListItemAvatar>
                    <StyledItemIconAvatar>
                      <OpenInNewOutlinedIcon />
                    </StyledItemIconAvatar>
                  </ListItemAvatar>
                  <StyledItemText primary="Open with" />
                </StyledItemButton>
              </ListItem>
              <ListItem disablePadding>
                <StyledItemButton alignItems="center" onClick={handleZap}>
                  <ListItemAvatar>
                    <StyledItemIconAvatar>
                      <FlashOnIcon />
                    </StyledItemIconAvatar>
                  </ListItemAvatar>
                  <StyledItemText primary="Zap" />
                </StyledItemButton>
              </ListItem>
            </>
          )}
        </StyledList>
      </Container>
    </Modal>
  )
}
