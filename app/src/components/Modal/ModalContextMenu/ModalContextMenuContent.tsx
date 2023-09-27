import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { Container } from '@/layout/Container/Conatiner'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import { StyledInput, StyledItemButton, StyledItemIconAvatar, StyledItemText, StyledList } from './styled'
import { IconButton, ListItem, ListItemAvatar } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { stringToBech32 } from '@/modules/nostr'
import { useOpenApp } from '@/hooks/open-entity'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'

export const ModalContextMenuContent = () => {

  const [searchParams] = useSearchParams()
  const { handleOpen, handleClose } = useOpenModalSearchParams()
  const { openZap } = useOpenApp()
  const tabUrl = searchParams.get('tabUrl') || ''
  const id = searchParams.get('nostrId') || tabUrl
  const addr = stringToBech32(id)

  const handleOpenModalSelect = () => {
    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: addr } })
  }

  const handleZap = async () => {
    const addr = stringToBech32(id)
    //    const event = await fetchEventByBech32(addr)
    openZap(addr)
  }

  const handleShareTabUrl = async () => {
    await handleClose()
    window.navigator.share({ url: tabUrl })
  }

  return (
    <Container>
      <StyledInput
        endAdornment={
          <IconButton color="inherit" size="medium" onClick={() => copyToClipBoard(id)}>
            <ContentCopyOutlinedIcon />
          </IconButton>
        }
        readOnly
        value={id || ''}
      />
      <StyledList>
        <ListItem disablePadding>
          <StyledItemButton alignItems="center" onClick={handleShareTabUrl}>
            <ListItemAvatar>
              <StyledItemIconAvatar>
                <IosShareOutlinedIcon />
              </StyledItemIconAvatar>
            </ListItemAvatar>
            <StyledItemText primary="Share URL" />
          </StyledItemButton>
        </ListItem>
        {addr && (
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
  )
}
