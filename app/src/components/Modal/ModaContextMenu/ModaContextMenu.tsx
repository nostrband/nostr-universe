import { useOpenModalSearchParams } from '@/hooks/modal'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { StyledItemButton, StyledItemIconAvatar, StyledItemText, StyledList } from './styled'
import { ListItem, ListItemAvatar } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { fetchEventByBech32, launchZapDialog, stringToBech32 } from '@/modules/nostr'

export const ModaContextMenu = () => {
  const [searchParams] = useSearchParams()
  const { getModalOpened, handleClose, handleOpen } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.CONTEXT_MENU)
  const id = searchParams.get('tabId') || ''

  const handleOpenModalSelect = () => {
    const addr = stringToBech32(id)
    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: addr } })
  }

  const handleZap = async () => {
    const addr = stringToBech32(id)
    const event = await fetchEventByBech32(addr)
    launchZapDialog(addr, event)
  }

  return (
    <Modal title="Context Menu (WIP)" open={isOpen} handleClose={() => handleClose()}>
      <Container>
        <StyledList>
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
        </StyledList>
      </Container>
    </Modal>
  )
}
