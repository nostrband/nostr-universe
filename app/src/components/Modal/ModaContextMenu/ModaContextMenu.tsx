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

export const ModaContextMenu = () => {
  const { onCloseTab } = useOpenApp()
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.CONTEXT_MENU)
  const { currentTab } = useAppSelector((state) => state.tab)
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)

  const isPin = currentWorkSpace.pins.find((pin) => pin.id === currentTab?.id)

  const handleCloseTab = () => {
    handleClose()
    onCloseTab()
  }

  return (
    <Modal title="Tab Menu (WIP)" open={isOpen} handleClose={handleClose}>
      <Container>
        <StyledInfoItem>URL: {currentTab?.url}</StyledInfoItem>
        <StyledInfoItem>App: {currentTab?.name}</StyledInfoItem>

        <StyledList>
          <ListItem disablePadding>
            <StyledItemButton alignItems="center">
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
