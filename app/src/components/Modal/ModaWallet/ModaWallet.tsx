import { useEffect } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { Button } from '@mui/material'
// import { useAppSelector } from '@/store/hooks/redux'
// import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
// import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
// import { StyledInfoItem, StyledItemButton, StyledItemIconAvatar, StyledItemText, StyledList } from './styled'
// import { ListItem, ListItemAvatar } from '@mui/material'
// import { useOpenApp } from '@/hooks/open-entity'
// import { useSearchParams } from 'react-router-dom'
import { walletstore } from '@/modules/walletstore'
import { StyledList } from './styled'

export const ModaWallet = () => {
  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.WALLET_MODAL)

  // const [wallets, setWallets] = useState([])
  // const [currentWalletId, setCurrentWalletId] = useState('')

  const load = async () => {
    const r = await walletstore.listWallets()
    // setCurrentWalletId(r.currentAlias || '')
    const walletsPrepare = Object.values(r).filter((v) => typeof v === 'object')
    console.log(JSON.stringify({ walletsPrepare }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // setWallets(walletsPrepare)
  }

  useEffect(() => {
    load()
  }, [isOpen])

  const handleAddWallet = async () => {
    try {
      const r = await walletstore.addWallet()
      console.log('add result', JSON.stringify(r))
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.plugins.toast.showShortBottom(`Operation failed: ${e}`)
    }
    load()
  }

  return (
    <Modal title="Wallet" open={isOpen} handleClose={() => handleClose()}>
      <Container>
        <StyledList>
          <Button fullWidth variant="contained" className="button" color="secondary" onClick={handleAddWallet}>
            Add wallet
          </Button>
          {/* <ListItem disablePadding>
            <StyledItemButton alignItems="center" onClick={handlePinUnPinTab}>
              <ListItemAvatar>
                <StyledItemIconAvatar>
                  {isPin ? <DeleteOutlineOutlinedIcon /> : <PushPinOutlinedIcon />}
                </StyledItemIconAvatar>
              </ListItemAvatar>
              <StyledItemText primary="Unpin" />
            </StyledItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledItemButton alignItems="center" onClick={handleCloseTab}>
              <ListItemAvatar>
                <StyledItemIconAvatar>
                  <CloseOutlinedIcon />
                </StyledItemIconAvatar>
              </ListItemAvatar>
              <StyledItemText primary="Close tab" />
            </StyledItemButton>
          </ListItem> */}
        </StyledList>
      </Container>
    </Modal>
  )
}
