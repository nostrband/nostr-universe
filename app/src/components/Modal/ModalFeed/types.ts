import { AppNostr } from '@/types/app-nostr'
import { AugmentedEvent } from '@/types/augmented-event'
import { AuthoredEvent } from '@/types/authored-event'
import { ExtendedCommunityEvent } from '@/types/communities'

export interface MultiEvent extends AuthoredEvent {
  post?: ExtendedCommunityEvent
}

export type ReturnDataContent = MultiEvent[]

export interface RowProps {
  data: ReturnDataContent
  index: number
  setSize: (index: number, size: number) => void
}

export interface ModalFeedContentProps {
  dataContent: ReturnDataContent
}

export interface IEventFeed extends AugmentedEvent, AppNostr {}
