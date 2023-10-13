import { MetaEvent } from '@/types/meta-event'

export type IBestLongNoteItem = {
  pubkey: string
  author?: MetaEvent
  content: string
  reactionKind: number
  reactionTime: number
}
