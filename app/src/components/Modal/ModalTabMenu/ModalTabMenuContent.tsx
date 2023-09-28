import { IconButton } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  StyledItemButton,
  StyledItemIconAvatar,
  StyledItemText,
  StyledList,
  StyledWrapInput
} from './styled'
import { ListItem, ListItemAvatar } from '@mui/material'
import { useOpenApp } from '@/hooks/open-entity'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { stringToBech32 } from '@/modules/nostr'
import { selectTab } from '@/store/reducers/tab.slice'
import { Input } from '@/shared/Input/Input'
import { IModalTabMenuContent } from './types'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'

export const ModalTabMenuContent = ({ handleCloseModal }: IModalTabMenuContent) => {
  const [searchParams] = useSearchParams()
  const { onCloseTab, onPinTab, onUnPinTab, findTabPin } = useOpenApp()
  const [, setEventAddr] = useState('')
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
    handleCloseModal('/')
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
          defaultValue={url}
        />
      </StyledWrapInput>
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
  )
}
