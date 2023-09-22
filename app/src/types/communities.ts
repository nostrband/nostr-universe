import { Event } from "@nostrband/nostr-tools"
import { AuthoredEvent } from "./authored-event"
import { MetaEvent } from "./meta-event"

export interface CommunityEvent extends AuthoredEvent {
  name: string
  description: string
  image: string
  moderators: string[]
  moderatorsMetas: MetaEvent[]
}

export interface CommunityApprovalEvent extends AuthoredEvent {
  requestKind: number,
  requestEventId: string,
  requestEventAddr: string,
  requestPubkey: string
  request: Event
}

export interface CommunityApprovalInfo {
  communityPubkey: string,
  communityIdentifier: string,
  created_at: number,
}

export interface ExtendedCommunityEvent extends CommunityEvent {
  last_post_tm: number,
  posts: number
}

export function createCommunityEvent(e: AuthoredEvent): CommunityEvent {
  const c = e as CommunityEvent
  c.name = ''
  c.description = ''
  c.image = ''
  c.moderators = []
  c.moderatorsMetas = []
  return c
}

export function createExtendedCommunityEvent(e: CommunityEvent): ExtendedCommunityEvent {
  const c = e as ExtendedCommunityEvent
  c.last_post_tm = 0
  c.posts = 0
  return c
} 

export function createCommunityApprovalInfo(): CommunityApprovalInfo {
  return {
    communityPubkey: '',
    communityIdentifier: '',
    created_at: 0,
  }
}