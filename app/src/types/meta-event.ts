import { Meta } from "./meta"
import { AugmentedEvent } from "./augmented-event"

export interface MetaEvent extends AugmentedEvent {
  profile?: Meta
}

export function createMetaEvent(e: AugmentedEvent): MetaEvent {
  // profile is optional, so this is fine
  return e as MetaEvent
}