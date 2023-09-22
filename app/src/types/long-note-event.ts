import { AuthoredEvent } from './authored-event'

export interface LongNoteEvent extends AuthoredEvent {
  title: string
  summary: string
  published_at: number
}

export function createLongNoteEvent(e: AuthoredEvent): LongNoteEvent {
  const c = e as LongNoteEvent
  c.title = ''
  c.summary = ''
  c.published_at = 0
  return c
}
