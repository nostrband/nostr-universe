import { useOpenModalSearchParams } from '@/hooks/modal'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { StyledItemButton, StyledItemIconAvatar, StyledItemText, StyledList } from './styled'
import { ListItem, ListItemAvatar } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { stringToBech32 } from '@/modules/nostr'
import { useOpenApp } from '@/hooks/open-entity'

export const ModalContextMenu = () => {
  const [searchParams] = useSearchParams()
  const { getModalOpened, handleClose, handleOpen } = useOpenModalSearchParams()
  const { openZap } = useOpenApp()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.CONTEXT_MENU)
  const id = searchParams.get('nostrId') || ''
  const addr = stringToBech32(id)

  const handleOpenModalSelect = () => {
    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: addr } })
  }

  const handleZap = async () => {
    const addr = stringToBech32(id)
    //    const event = await fetchEventByBech32(addr)
    openZap(addr)
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
