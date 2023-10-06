import { MetaEvent } from '@/types/meta-event'

export interface IAccount extends MetaEvent {
  isReadOnly: boolean
  isNsb: boolean
}

export interface IModalAccounts {
  open: boolean
  handleClose: () => void
  changeAccount: (pubkey: string) => void
  accounts: IAccount[]
  currentPubKey: string
}
