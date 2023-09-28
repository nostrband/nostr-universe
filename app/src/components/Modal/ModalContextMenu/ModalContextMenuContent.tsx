import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { Container } from '@/layout/Container/Conatiner'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { StyledInput, StyledItemButton, StyledItemIconAvatar, StyledItemText, StyledList } from './styled'
import { IconButton, ListItem, ListItemAvatar } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { stringToBech32 } from '@/modules/nostr'
import { useOpenApp } from '@/hooks/open-entity'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'
import { ReactNode } from 'react'

export const ModalContextMenuContent = () => {

  const [searchParams] = useSearchParams()
  const { handleOpen, handleClose } = useOpenModalSearchParams()
  const { openZap } = useOpenApp()
  const tabUrl = searchParams.get('tabUrl') || ''
  const text = searchParams.get('text') || ''
  const href = searchParams.get('href') || ''
  const imgSrc = searchParams.get('imgSrc') || ''
  const videoSrc = searchParams.get('videoSrc') || ''
  const audioSrc = searchParams.get('audioSrc') || ''
  const value = searchParams.get('bech32') || href || text || imgSrc || videoSrc || audioSrc
  const addr = stringToBech32(value || tabUrl)

  const handleOpenModalSelect = () => {
    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: addr } })
  }

  const handleZap = async () => {
    openZap(addr)
  }

  const handleShareTabUrl = async () => {
    await handleClose()
    window.navigator.share({ url: tabUrl })
  }

  const handleShareValue = async () => {
    await handleClose()
    window.navigator.share({ text: value })
  }

  const handleCopyValue = () => {
    copyToClipBoard(value)
  }

  const renderItem = (label: string, icon: ReactNode, handler: () => void) => {
    return (
      <ListItem disablePadding>
        <StyledItemButton alignItems="center" onClick={handler}>
          <ListItemAvatar>
            <StyledItemIconAvatar>
              {icon}
            </StyledItemIconAvatar>
          </ListItemAvatar>
          <StyledItemText primary={label} />
        </StyledItemButton>
      </ListItem>

    )
  }

  return (
    <Container>
      <StyledInput
        endAdornment={
          <IconButton color="inherit" size="medium" onClick={handleCopyValue}>
            <ContentCopyOutlinedIcon />
          </IconButton>
        }
        readOnly
        value={value || ''}
      />
      <StyledList>
        {value && renderItem("Share text", (<ShareOutlinedIcon />), handleShareValue)}
        {addr && renderItem("Open with", (<OpenInNewOutlinedIcon />), handleOpenModalSelect)}
        {addr && renderItem("Zap", (<FlashOnIcon />), handleZap)}
        {renderItem("Share tab URL", (<IosShareOutlinedIcon />), handleShareTabUrl)}
      </StyledList>
    </Container>
  )
}
