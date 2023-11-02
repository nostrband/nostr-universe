import { RecentEvent } from '@/store/reducers/searchModal.slice'
import { EVENTS } from './types'

export const TAB_LABELS: { [key: string]: { label: string; key: EVENTS } } = {
  [EVENTS.NOTES]: {
    label: 'Notes',
    key: EVENTS.NOTES
  },
  [EVENTS.PROFILES]: {
    label: 'Profiles',
    key: EVENTS.PROFILES
  },
  [EVENTS.LONG_POSTS]: {
    label: 'Long Posts',
    key: EVENTS.LONG_POSTS
  }
}

const KINDS: { [key: number]: string } = {
  1: EVENTS.NOTES,
  0: EVENTS.PROFILES,
  30023: EVENTS.LONG_POSTS
}

export const prepareRecentEvents = (recentEvents: RecentEvent[] = []) => {
  return recentEvents.reduce(
    (acc, current) => {
      const eventKey = KINDS[current.kind]
      if (eventKey) {
        if (!acc[eventKey]) {
          acc[eventKey] = []
        }
        acc[eventKey].push(current)
        acc[eventKey].sort((a, b) => b.timestamp - a.timestamp)
      }
      return acc
    },
    {} as { [key: string]: RecentEvent[] }
  )
}

export const formatTime = (tm: number) => {
  let o = (Date.now() - tm) / 1000

  const future = o < 0

  o = Math.abs(o)

  let s = Math.round(o) + 's'
  o = o / 60
  if (o >= 1.0) s = Math.round(o) + 'm'
  o /= 60
  if (o >= 1.0) s = Math.round(o) + 'h'
  o /= 24
  if (o >= 1.0) s = Math.round(o) + 'd'

  return (future ? '+' : '') + s
}

export const getRecentQueryInfo = (timestamp: number = 0, query: string = '') => {
  return `${query ? `By «${query}»` : ''} ${formatTime(timestamp)} ago`
}
