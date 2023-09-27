import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { StyledInfoItem, StyledItemButton, StyledItemIconAvatar, StyledItemText, StyledList } from './styled'
import { ListItem, ListItemAvatar } from '@mui/material'
import { useOpenApp } from '@/hooks/open-entity'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { stringToBech32 } from '@/modules/nostr'
import { selectTab } from '@/store/reducers/tab.slice'

export const ModalTabMenu = () => {
  const [searchParams] = useSearchParams()
  const { onCloseTab, onPinTab, onUnPinTab, findTabPin } = useOpenApp()
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const [, setEventAddr] = useState('')
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TAB_MENU)
  const id = searchParams.get('tabId') || ''

  const currentTab = useAppSelector((state) => selectTab(state, id))

  const isPin = currentTab ? !!findTabPin(currentTab) : false
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
    if (currentTab) {
      if (isPin) {
        console.log('unpin')
        onUnPinTab(currentTab)
      } else {
        console.log('pin')
        onPinTab(currentTab)
      }
    }
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
              <StyledItemText primary={isPin ? 'Unpin' : 'Pin'} />
            </StyledItemButton>
          </ListItem>
        </StyledList>
      </Container>
    </Modal>
  )
}
