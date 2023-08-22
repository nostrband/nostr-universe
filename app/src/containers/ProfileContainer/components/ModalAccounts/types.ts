import { ReturnProfileType } from '@/types/profile'

export interface IModalAccounts {
  open: boolean
  handleClose: () => void
  changeAccount: (pubkey: string) => void
  accounts: ReturnProfileType[]
  currentPubKey: string
}
