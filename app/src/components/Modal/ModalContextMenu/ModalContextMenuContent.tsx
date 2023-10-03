import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { Container } from '@/layout/Container/Conatiner'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import { StyledInput, StyledItemIconAvatar, StyledItemText, StyledMenuWrapper } from './styled'
import { IconButton, List, ListItem, ListItemAvatar, ListItemButton } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { stringToBech32, stringToBolt11 } from '@/modules/nostr'
import { useOpenApp } from '@/hooks/open-entity'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'
import { ReactNode, useCallback } from 'react'

export const ModalContextMenuContent = () => {
  const [searchParams] = useSearchParams()
  const { handleOpen, handleClose } = useOpenModalSearchParams()
  const { openZap, openBlank } = useOpenApp()
  const tabUrl = searchParams.get('tabUrl') || ''
  const text = searchParams.get('text') || ''
  const href = searchParams.get('href') || ''
  const imgSrc = searchParams.get('imgSrc') || ''
  const videoSrc = searchParams.get('videoSrc') || ''
  const audioSrc = searchParams.get('audioSrc') || ''
  let value = searchParams.get('bech32') || href || text || imgSrc || videoSrc || audioSrc
  const addr = stringToBech32(value || tabUrl)
  const [invoice, bolt11] = stringToBolt11(value || tabUrl)
  console.log("invoice", invoice, "bolt11", JSON.stringify(bolt11))
  if (!value) value = addr // from tabUrl

  const handleOpenModalSelect = () => {
    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
      search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: addr },
      replace: true
    })
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

  const handleOpenHref = () => {
    openBlank({ url: href }, { replace: true })
  }

  const renderItem = useCallback((label: string, icon: ReactNode, handler: () => void) => {
    return (
      <ListItem disablePadding>
        <ListItemButton alignItems="center" onClick={handler}>
          <ListItemAvatar>
            <StyledItemIconAvatar>{icon}</StyledItemIconAvatar>
          </ListItemAvatar>
          <StyledItemText primary={label} />
        </ListItemButton>
      </ListItem>
    )
  }, [])

  return (
    <Container>
      {value && (
        <StyledInput
          endAdornment={
            <IconButton color="inherit" size="medium" onClick={handleCopyValue}>
              <ContentCopyOutlinedIcon />
            </IconButton>
          }
          readOnly
          value={value || ''}
        />
      )}
      <StyledMenuWrapper>
        <List>
          {addr && renderItem('Open with', <AppsOutlinedIcon />, handleOpenModalSelect)}
          {addr && renderItem('Zap', <FlashOnIcon />, handleZap)}
          {href && renderItem('Open in new tab', <OpenInNewOutlinedIcon />, handleOpenHref)}
          {value && renderItem('Share text', <ShareOutlinedIcon />, handleShareValue)}
          {renderItem('Share tab URL', <IosShareOutlinedIcon />, handleShareTabUrl)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
