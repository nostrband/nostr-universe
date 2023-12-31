import { useState } from 'react'
import { Alert, Avatar, Chip, IconButton, Menu, MenuItem } from '@mui/material'
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import {
  StyledViewTitle,
  StyledViewText,
  StyledWrapper,
  StyledItemBlock,
  StyledPaymentAmountActions,
  StyledWrapperAmount,
  StyledPaymentAmount,
  StyledViewTitleName,
  StyledPaymentInfo
} from './styled'
import { copyToClipBoard, getProfileName } from '@/utils/helpers/prepare-data'
import { formatHours } from '@/consts/index'
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

export const PaymentItem = ({
  url,
  time,
  walletName,
  walletId,
  amount,
  preimage,
  receiverPubkey,
  receiver
}: IPaymentItem) => {
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

  const getNameWallet = walletName || walletId
  const getUrl = new URL(url).hostname
  const getTime = format(new Date(time), formatHours)
  const getAmount = amount / 1000

  return (
    <StyledWrapper>
      <StyledWrapperAmount>
        <StyledPaymentAmount>
          {receiverPubkey ? (
            <Avatar src={receiver?.profile?.picture} />
          ) : (
            <Avatar>
              <DoDisturbOnOutlinedIcon />
            </Avatar>
          )}
          <StyledPaymentInfo>
            <StyledViewTitleName>
              {receiverPubkey ? getProfileName(receiverPubkey, receiver) : 'Payment'}
            </StyledViewTitleName>
            <StyledViewText variant="body1" component="div">{`From: ${getNameWallet}`}</StyledViewText>
            <StyledViewText>{`At: ${getUrl}`}</StyledViewText>
          </StyledPaymentInfo>
        </StyledPaymentAmount>

        <StyledPaymentAmountActions>
          <StyledViewTitle>{getAmount} sats</StyledViewTitle>
          <Chip color="secondary" label={getTime} />
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
        </StyledPaymentAmountActions>
      </StyledWrapperAmount>
      {!preimage && (
        <StyledItemBlock>
          <Alert severity="error">Payment not confirmed</Alert>
        </StyledItemBlock>
      )}
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
