import { ReturnProfileType } from '@/types/profile'

export interface IModalAccounts {
  open: boolean
  handleClose: () => void
  accounts: ReturnProfileType[]
  currentPubKey: string
}
