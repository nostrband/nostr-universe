import { MetaEvent } from '@/types/meta-event'

export interface IItemLongNote {
  pubkey: string
  author?: MetaEvent
  time: number
  content: string
  subtitle: string
  onClick: () => void
}
