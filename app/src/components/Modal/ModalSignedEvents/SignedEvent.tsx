import { useState } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { StyledViewTitle, StyledWrapper, StyledInputWrap, StyledHead } from './styled'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'
import { kindEvents } from '@/consts/index'
import { Input } from '@/shared/Input/Input'
import { format } from 'date-fns'
interface ISignedEvent {
  url: string
  kind: string
  time: number
  id?: string
  eventId: string
  eventJson: string
  handleShowContent: (content: string) => void
}
export const SignedEvent = ({ url, kind, time, eventId, eventJson, handleShowContent }: ISignedEvent) => {
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
  const handleCopyEvent = () => {
    copyToClipBoard(eventId)
    handleClose()
  }
  const handleShowDialogContent = () => {
    handleShowContent(eventJson)
    handleClose()
  }
  const getKind = kindEvents[kind] || kind
  const getUrl = new URL(url).origin
  const getTime = format(new Date(time), 'MM.dd.yyyy | HH:mm')
  return (
    <StyledWrapper>
      <StyledHead>
        <StyledViewTitle>Kind {getKind}</StyledViewTitle>
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
      By {getUrl} at {getTime}
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
        <MenuItem onClick={handleCopyUrl}>Copy id</MenuItem>
        <MenuItem onClick={handleCopyEvent}>Copy event</MenuItem>
      </Menu>
    </StyledWrapper>
  )
}
