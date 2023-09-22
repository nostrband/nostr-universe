import { MetaEvent } from '@/types/meta-event'

export interface IItemHighlight {
  pubkey: string
  author?: MetaEvent
  time: number
  content: string
}
