import { IconButton, List, ListItemButton } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'
import OpenInBrowserOutlinedIcon from '@mui/icons-material/OpenInBrowserOutlined'
import { StyledItemIconAvatar, StyledItemText, StyledMenuWrapper, StyledWrapInput } from './styled'
import { ListItem, ListItemAvatar } from '@mui/material'
import { useOpenApp } from '@/hooks/open-entity'
import { useSearchParams } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from 'react'
import { stringToBech32 } from '@/modules/nostr'
import { selectTab } from '@/store/reducers/tab.slice'
import { Input } from '@/shared/Input/Input'
import { IModalTabMenuContent } from './types'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'
import { usePins } from '@/hooks/pins'

export const ModalTabMenuContent = ({ handleCloseModal }: IModalTabMenuContent) => {
  const [searchParams] = useSearchParams()
  const { onCloseTab, openBlank } = useOpenApp()
  const { onPinTab, onUnPinTab, findTabPin } = usePins()
  const [, setEventAddr] = useState('')
  const id = searchParams.get('tabId') || ''
  const currentTab = useAppSelector((state) => selectTab(state, id))
  const { page } = useAppSelector((state) => state.positionScrollPage)
  // const location = useLocation()
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
    if (page === '/') {
      handleCloseModal('/')
    } else {
      handleCloseModal(`?page=${page}`)
    }

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

  const copyAddrHandler = () => {
    copyToClipBoard(url || '')
  }

  const handleOpenTabUrlIntent = () => {
    openBlank({ url: 'intent:' + url }, {})
  }

  const handleShareTabUrl = async () => {
    await handleCloseModal()
    window.navigator.share({ url })
  }

  const renderItem = useCallback((label: string, icon: React.ReactNode, handler: () => void) => {
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
      <StyledWrapInput>
        <Input
          endAdornment={
            <IconButton color="inherit" size="medium" onClick={copyAddrHandler}>
              <ContentCopyIcon />
            </IconButton>
          }
          readOnly
          value={url}
        />
      </StyledWrapInput>
      <StyledMenuWrapper>
        <List>
          {renderItem('Close tab', <CloseOutlinedIcon />, handleCloseTab)}
          {renderItem(
            isPin ? 'Unpin' : 'Pin',
            isPin ? <DeleteOutlineOutlinedIcon /> : <PushPinOutlinedIcon />,
            handlePinUnPinTab
          )}
          {renderItem('Share', <IosShareOutlinedIcon />, handleShareTabUrl)}
          {renderItem('Open in system browser', <OpenInBrowserOutlinedIcon />, handleOpenTabUrlIntent)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
