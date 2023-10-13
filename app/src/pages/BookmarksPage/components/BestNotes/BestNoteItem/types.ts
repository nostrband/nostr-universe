import { MetaEvent } from '@/types/meta-event'

export interface IBestNoteItem {
  pubkey: string
  author?: MetaEvent
  content: string
  reactionKind: number
  reactionTime: number
}
