import { AuthoredEvent } from './authored-event'
import { MetaEvent } from './meta-event'

export interface ProfileListEvent extends AuthoredEvent {
  name?: string
  description?: string
  privateProfilePubkeys: string[]
  publicProfilePubkeys: string[]
  profileEvents: MetaEvent[]
}

export function createProfileListEvent(e: AuthoredEvent): ProfileListEvent {
  const c = e as ProfileListEvent
  c.privateProfilePubkeys = []
  c.publicProfilePubkeys = []
  c.profileEvents = []
  return c
}
