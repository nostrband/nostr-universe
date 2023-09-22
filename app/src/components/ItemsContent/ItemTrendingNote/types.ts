import { MetaEvent } from '@/types/meta-event'

export interface IItemTrendingNote {
  pubkey: string
  author?: MetaEvent
  time: number
  content: string
}
