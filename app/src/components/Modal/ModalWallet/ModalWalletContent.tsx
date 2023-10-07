import { useEffect, useState } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import { ListItem, ListItemAvatar, IconButton } from '@mui/material'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { walletstore } from '@/modules/walletstore'
import {
  StyledAaddButton,
  StyledAlert,
  StyledInfoItem,
  StyledItemButton,
  StyledItemIconAvatar,
  StyledItemText,
  StyledList
} from './styled'
import { showToast } from '@/utils/helpers/general'

interface IWallet {
  id: string
  name: string
  publicKey: string
  isCurrent: boolean
  relay: string
}

export const ModalWalletContent = () => {
  const [wallets, setWallets] = useState<IWallet[]>([])
  const [currentWalletId, setCurrentWalletId] = useState('')

  const getCurrentWalet = wallets.find((w) => w.id === currentWalletId)
  const getWallets = wallets.filter((wallet) => wallet.id !== currentWalletId)

  const loadWallet = async () => {
    const r = await walletstore.listWallets()
    setCurrentWalletId(r.currentAlias || '')
    const walletsPrepare = Object.values(r).filter((v) => typeof v === 'object')
    console.log('wallets', JSON.stringify(walletsPrepare))
    setWallets(walletsPrepare as IWallet[])
  }

  const handleAddWallet = async () => {
    try {
      const r = await walletstore.addWallet()
      console.log('add result', JSON.stringify(r))
    } catch (e) {
      showToast(`Operation failed: ${e}`)
    }
    loadWallet()
  }

  const onDelete = async (w: IWallet) => {
    console.log('delete', w.id)
    const r = await walletstore.deleteWallet(w.id)
    console.log('delete result', JSON.stringify(r))
    loadWallet()
  }

  const onSelect = async (id: string) => {
    console.log('select', id)
    await walletstore.selectWallet(id)
    loadWallet()
  }

  useEffect(() => {
    loadWallet()
  }, [])

  return (
    <Container>
      <StyledInfoItem variant="h5" component="div">
        Current wallet:
      </StyledInfoItem>
      {!currentWalletId && (
        <StyledAlert severity="warning">Select a wallet to make it current and accessible to apps.</StyledAlert>
      )}

      {getCurrentWalet && (
        <StyledList>
          <ListItem
            disablePadding
            secondaryAction={
              <IconButton color="inherit" size="medium" onClick={() => onSelect('')}>
                <CloseOutlinedIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <StyledItemIconAvatar>
                <AccountBalanceWalletOutlinedIcon />
              </StyledItemIconAvatar>
            </ListItemAvatar>
            <StyledItemText primary={getCurrentWalet?.name} secondary={getCurrentWalet?.relay} />
          </ListItem>
        </StyledList>
      )}

      <StyledInfoItem variant="h5" component="div">
        {currentWalletId ? 'Other wallets' : 'Your wallets'}:
      </StyledInfoItem>
      {!wallets.length ? (
        <StyledInfoItem variant="body2">No wallets yet.</StyledInfoItem>
      ) : (
        <StyledList>
          {getWallets.map((wallet) => (
            <ListItem
              key={wallet.id}
              disablePadding
              secondaryAction={
                <IconButton color="inherit" size="medium" onClick={() => onDelete(wallet)}>
                  <CloseOutlinedIcon />
                </IconButton>
              }
            >
              <StyledItemButton alignItems="center" onClick={() => onSelect(wallet.id)}>
                <ListItemAvatar>
                  <StyledItemIconAvatar>
                    <AccountBalanceWalletOutlinedIcon />
                  </StyledItemIconAvatar>
                </ListItemAvatar>
                <StyledItemText primary={wallet?.name} secondary={wallet?.relay} />
              </StyledItemButton>
            </ListItem>
          ))}
        </StyledList>
      )}

      <StyledAaddButton
        fullWidth
        variant="contained"
        size="large"
        className="button"
        color="secondary"
        onClick={handleAddWallet}
      >
        Add wallet
      </StyledAaddButton>
    </Container>
  )
}
