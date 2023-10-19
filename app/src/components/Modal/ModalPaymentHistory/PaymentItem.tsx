import { useState } from 'react'
import { Alert, Chip, IconButton, Menu, MenuItem } from '@mui/material'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { StyledViewTitle, StyledWrapper, StyledHead, StyledItemBlock, StyledItemFooter } from './styled'
import { copyToClipBoard, getProfileName } from '@/utils/helpers/prepare-data'
import { formatDateHours } from '@/consts/index'
import { format } from 'date-fns'
import { MetaEvent } from '@/types/meta-event'

interface IPaymentItem {
  walletId?: string
  url: string
  time: number
  walletName: string
  amount: number
  preimage: string
  receiverPubkey: string
  receiver?: MetaEvent
}

export const PaymentItem = ({ url, time, walletName, walletId, amount, preimage, receiverPubkey, receiver }: IPaymentItem) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCopyPreimage = () => {
    copyToClipBoard(preimage)
    handleClose()
  }

  const getName = walletName || walletId
  const getUrl = new URL(url).hostname
  const getTime = format(new Date(time), formatDateHours)

  return (
    <StyledWrapper>
      <StyledHead>
        <StyledViewTitle>-{amount / 1000} sats</StyledViewTitle>
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
      <StyledItemBlock>
        <Chip color="secondary" label={`Wallet: ${getName}`} />
      </StyledItemBlock>
      {!preimage && (
        <StyledItemBlock>
          <Alert severity="error">Payment not confirmed</Alert>
        </StyledItemBlock>
      )}
      {receiverPubkey && (
        <StyledItemBlock>
          <Alert severity="info">Zap to {getProfileName(receiverPubkey, receiver)}</Alert>
        </StyledItemBlock>
      )}
      <StyledItemFooter>
        On {getUrl} at {getTime}
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
        <MenuItem onClick={handleCopyPreimage}>Copy preimage</MenuItem>
      </Menu>
    </StyledWrapper>
  )
}
