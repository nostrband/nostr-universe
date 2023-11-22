import { AppNostr } from '@/types/app-nostr'
import { AugmentedEvent } from '@/types/augmented-event'
import { AuthoredEvent } from '@/types/authored-event'
import { HighlightEvent } from '@/types/highlight-event'
import { SuggestedProfile } from '@/types/suggested-profiles'
import { TrendingNote } from '@/types/trending-notes'
import { ZapEvent } from '@/types/zap-event'

type SuggestedProfileType = {
  author: SuggestedProfile
  pubkey: string
  content: string
  website: string
  kind: number
}

export type ReturnDataContent =
  | HighlightEvent[]
  | AuthoredEvent[]
  | ZapEvent[]
  | SuggestedProfileType[]
  | TrendingNote[]
  | AppNostr[]

export interface RowProps {
  data: ReturnDataContent
  index: number
  setSize: (index: number, size: number) => void
}

export interface ModalFeedContentProps {
  dataContent: ReturnDataContent
}

export interface IEventFeed extends AugmentedEvent, AppNostr {}
