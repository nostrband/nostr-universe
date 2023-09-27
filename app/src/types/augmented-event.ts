import { Event, Kind } from '@nostrband/nostr-tools'

export interface AugmentedEvent extends Event {
  order: number
  identifier: string
}

export function createEvent(o: object): Event {
  const c = o as Event
  if (!c.pubkey) c.pubkey = ''
  if (!c.content) c.content = ''
  if (!c.created_at) c.created_at = 0
  if (c.kind === undefined) c.kind = -1 as Kind
  if (!c.sig) c.sig = ''
  if (!c.id) c.id = ''
  if (!c.tags) c.tags = []
  return c
}

export function createAugmentedEvent(e: Event): AugmentedEvent {
  const c = e as AugmentedEvent
  c.order = 0
  c.identifier = ''
  return c
}
