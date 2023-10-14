import { MetaEvent } from '@/types/meta-event'

export interface IBestNoteItem {
  pubkey: string
  author?: MetaEvent
  content: string
  time: number
  reactionKind: number
  reactionTime: number
  onClick: () => void
}
