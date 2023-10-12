import { AuthoredEvent } from "./authored-event";
import { Meta } from "./meta";
import { MetaEvent } from "./meta-event";

export interface AppUrl {
  url: string
  type: string
}

export interface AppEvent extends AuthoredEvent {
  naddr: string
  appAuthorPubkey: string
  appAuthorMeta?: MetaEvent
  meta?: Meta
  kinds: number[]
  platforms: string[]
  urls: AppUrl[]
  appId: string
  eventUrl?: string
}

export function createAppEvent(e: AuthoredEvent): AppEvent {
  const c = e as AppEvent
  c.naddr = ''
  c.appAuthorPubkey = ''
  c.kinds = []
  c.platforms = []
  c.urls = []
  c.appId = ''
  return c
}
