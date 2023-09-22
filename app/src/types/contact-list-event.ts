import { AuthoredEvent } from "./authored-event";
import { MetaEvent } from "./meta-event";

export interface ContactListEvent extends AuthoredEvent {
  contactPubkeys: string[]
  contactEvents: MetaEvent[]  
}

export function createContactListEvent(e: AuthoredEvent): ContactListEvent {
  const c = e as ContactListEvent
  c.contactPubkeys = []
  c.contactEvents = []
  return c
}
