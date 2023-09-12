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

export const ModaTabMenu = () => {
  const [searchParams] = useSearchParams()
  const { onCloseTab } = useOpenApp()
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TAB_MENU)
  const id = searchParams.get('id') || ''

  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const currentTab = currentWorkSpace.tabs.find((tab) => tab.id === id)

  const isPin = currentWorkSpace.pins.find((pin) => pin.id === id)

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

  return (
    <Modal title="Tab Menu (WIP)" open={isOpen} handleClose={() => handleClose()}>
      <Container>
        <StyledInfoItem>URL: {currentTab?.url}</StyledInfoItem>
        <StyledInfoItem>App: {currentTab?.title}</StyledInfoItem>

        <StyledList>
          <ListItem disablePadding>
            <StyledItemButton alignItems="center" onClick={handlePinUnPinTab}>
              <ListItemAvatar>
                <StyledItemIconAvatar>
                  {isPin ? <DeleteOutlineOutlinedIcon /> : <PushPinOutlinedIcon />}
                </StyledItemIconAvatar>
              </ListItemAvatar>
              <StyledItemText primary="Unpin" />
            </StyledItemButton>
          </ListItem>
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
        </StyledList>
      </Container>
    </Modal>
  )
}
