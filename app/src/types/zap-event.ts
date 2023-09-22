import { Event } from "@nostrband/nostr-tools"
import { AuthoredEvent } from "./authored-event"
import { MetaEvent } from "./meta-event"

export interface ZapEvent extends AuthoredEvent {
  description?: Event
  bolt11?: Bolt11
  amountMsat: number
  targetEventId: string
  targetAddr: string
  targetPubkey: string
  providerPubkey: string
  senderPubkey: string
  targetEvent?: AuthoredEvent
  targetMeta?: MetaEvent
  providerMeta?: MetaEvent
  senderMeta?: MetaEvent
}

export interface Bolt11 {
  paymentRequest: string
  sections: Section[]
  expiry: number
  route_hints: string[]
}

export interface Section {
  name: string
  letters: string
  value: string
  tag?: string
}

export function createZapEvent(e: AuthoredEvent): ZapEvent {
  const c = e as ZapEvent
  c.amountMsat = 0
  c.targetEventId = ''
  c.targetAddr = ''
  c.targetPubkey = ''
  c.providerPubkey = ''
  c.senderPubkey = ''
  return c
}