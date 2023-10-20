import { AuthoredEvent } from './authored-event'

export interface Bookmark {
  eventId?: string
  eventAddr?: string
  url?: string
}

export interface BookmarkListEvent extends AuthoredEvent {
  name?: string
  description?: string
  privateBookmarks: Bookmark[]
  publicBookmarks: Bookmark[]
  events: AuthoredEvent[]
}

export function createBookmarkListEvent(e: AuthoredEvent): BookmarkListEvent {
  const c = e as BookmarkListEvent
  c.privateBookmarks = []
  c.publicBookmarks = []
  c.events = []
  return c
}
