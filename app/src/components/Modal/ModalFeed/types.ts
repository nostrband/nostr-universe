import { AppNostr } from '@/types/app-nostr'
import { AugmentedEvent } from '@/types/augmented-event'
import { AuthoredEvent } from '@/types/authored-event'

export type ReturnDataContent = AuthoredEvent[]

export interface RowProps {
  data: ReturnDataContent
  index: number
  setSize: (index: number, size: number) => void
}

export interface ModalFeedContentProps {
  dataContent: ReturnDataContent
}

export interface IEventFeed extends AugmentedEvent, AppNostr {}
