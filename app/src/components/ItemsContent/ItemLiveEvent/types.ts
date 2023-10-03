import { MetaEvent } from '@/types/meta-event'

export interface IItemLiveEvent {
  hostPubkey: string
  host?: MetaEvent
  time: number
  content: string
  subtitle: string
  status: string
  onClick: () => void
}
