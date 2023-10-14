import { MetaEvent } from '@/types/meta-event'

export type IBestLongNoteItem = {
  pubkey: string
  author?: MetaEvent
  content: string
  time: number
  reactionKind: number
  reactionTime: number
  onClick: () => void
}
