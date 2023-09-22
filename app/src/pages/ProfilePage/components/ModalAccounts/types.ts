import { MetaEvent } from '@/types/meta-event'

export interface IModalAccounts {
  open: boolean
  handleClose: () => void
  changeAccount: (pubkey: string) => void
  accounts: MetaEvent[]
  currentPubKey: string
}
