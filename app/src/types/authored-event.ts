import { MetaEvent } from "./meta-event"
import { AugmentedEvent } from "./augmented-event"

export interface AuthoredEvent extends AugmentedEvent {
  author?: MetaEvent
}

export function createAuthoredEvent(e: AugmentedEvent): AuthoredEvent {
  // author is optional, so this is fine
  return e as AuthoredEvent
}
