import { AuthoredEvent } from './authored-event'
import { MetaEvent } from './meta-event'

export interface LiveEvent extends AuthoredEvent {
  title: string
  summary: string
  starts: number
  current_participants: number
  status: string
  host: string
  members: string[]

  hostMeta?: MetaEvent
  membersMeta: MetaEvent[]
}

export function createLiveEvent(e: AuthoredEvent): LiveEvent {
  const c = e as LiveEvent
  c.title = ''
  c.summary = ''
  c.starts = 0
  c.current_participants = 0
  c.status = ''
  c.host = ''
  c.members = []
  c.membersMeta = []
  return c
}
