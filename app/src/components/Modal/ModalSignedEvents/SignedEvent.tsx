import { useState } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { StyledViewTitle, StyledWrapper, StyledInputWrap, StyledHead, StyledItemFooter } from './styled'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'
import { formatDateHours, kindNames } from '@/consts/index'
import { Input } from '@/shared/Input/Input'
import { format } from 'date-fns'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { IExtraOptions } from '@/hooks/modal'
import { getNevent } from '@/modules/nostr'

interface ISignedEvent {
  url: string
  kind: string
  time: number
  id?: string
  eventId: string
  eventJson: string
  handleShowContent: (content: string) => void
  handleOpen: (modal: MODAL_PARAMS_KEYS, extraOptions?: IExtraOptions) => void
}

export const SignedEvent = ({ url, kind, time, eventId, eventJson, handleShowContent, handleOpen }: ISignedEvent) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleCopyUrl = () => {
    copyToClipBoard(url)
    handleClose()
  }
  const handleCopyId = () => {
    copyToClipBoard(eventId)
    handleClose()
  }
  const handleCopyEvent = () => {
    copyToClipBoard(eventJson)
    handleClose()
  }
  const handleShowDialogContent = () => {
    handleShowContent(eventJson)
    handleClose()
  }
  const handleOpenWith = () => {
    const addr = getNevent(eventId)

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
      search: {
        [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: addr,
        [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(kind)
      }
    })
  }
  const getKind = kindNames[kind] + ` (${kind})` || `Kind ${kind}`
  const getUrl = new URL(url).hostname
  const getTime = format(new Date(time), formatDateHours)
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledViewTitle>{getKind}</StyledViewTitle>
        <IconButton
          color="inherit"
          size="medium"
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
      </StyledHead>
      <StyledInputWrap>
        <Input
          endAdornment={
            <IconButton color="inherit" size="medium" onClick={() => copyToClipBoard(eventId)}>
              <ContentCopyIcon />
            </IconButton>
          }
          readOnly
          value={eventId}
        />
      </StyledInputWrap>
      <StyledItemFooter>
        By {getUrl} at {getTime}
      </StyledItemFooter>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={handleShowDialogContent}>Show</MenuItem>
        <MenuItem onClick={handleOpenWith}>Open with</MenuItem>
        <MenuItem onClick={handleCopyId}>Copy id</MenuItem>
        <MenuItem onClick={handleCopyUrl}>Copy url</MenuItem>
        <MenuItem onClick={handleCopyEvent}>Copy event</MenuItem>
      </Menu>
    </StyledWrapper>
  )
}
