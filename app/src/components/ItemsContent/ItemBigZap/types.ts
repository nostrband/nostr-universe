import { MetaEvent } from '@/types/meta-event'

export interface IItemBigZap {
  targetPubkey: string
  targetMeta?: MetaEvent
  time: number
  subtitle: string
  onClick: () => void
}
