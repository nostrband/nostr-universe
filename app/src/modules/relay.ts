//! @ts-nocheck
import { matchFilter, matchFilters } from '@nostrband/nostr-tools'
import { dbi } from './db'
import { getEventAddr } from './nostr'
// eslint-disable-next-line
// @ts-ignore
import { NostrEvent } from '@nostrband/ndk'
import { Kinds } from './const/kinds'

const events: NostrEvent[] = []
const eventById = new Map<string, number>()
const eventsByKind = new Map<string, number[]>()
const eventsByAuthor = new Map<string, number[]>()
const eventsByAuthorKind = new Map<string, number[]>()
const eventsByAddr = new Map<string, number[]>()
// eslint-disable-next-line
const subs = new Map<string, any>()
const clients = new Map<string, LocalRelayClient>()

// set to true when all events are loaded from db
let started = false

let onBeforeNewEvent: ((e: NostrEvent) => void) | null = null

export function addLocalRelayEvents(events: NostrEvent[], fromSync?: boolean) {
  return events.map((e) => addLocalRelayEvent(e, fromSync))
}

export function setOnBeforeNewEvent(cb: (e: NostrEvent) => void) {
  onBeforeNewEvent = cb
}

function addLocalRelayEvent(e: NostrEvent, fromSync?: boolean) {
  if (eventById.has(e.id)) return false

  //  console.log("addLocalRelayEvent kind", e.kind, "id", e.id, "pubkey", e.pubkey)
  if (!fromSync) {
    // eslint-disable-next-line
    // @ts-ignore
    onBeforeNewEvent(e)
  }

  const index = events.length

  const put = (map: Map<string, number[]>, key: string, replace?: boolean) => {
    if (!map.has(key)) map.set(key, [])
    const a = map.get(key)
    if (replace && a && a.length > 0) {
      const oldIndex = a[0]
      const old = events[oldIndex]
      if (old.created_at < e.created_at) {
        a[0] = index
      }
    } else {
      a?.push(index)
    }
  }

  put(eventsByKind, e.kind + '')
  put(eventsByAuthor, e.pubkey)
  const replaceAuthorKind = e.kind === Kinds.META || e.kind === Kinds.CONTACT_LIST
  put(eventsByAuthorKind, e.kind + ':' + e.pubkey, replaceAuthorKind)
  const replaceAddr =
    e.kind === Kinds.META ||
    e.kind === Kinds.CONTACT_LIST ||
    (e.kind >= 10000 && e.kind < 20000) ||
    (e.kind >= 30000 && e.kind < 40000)
  put(eventsByAddr, getEventAddr(e), replaceAddr)
  eventById.set(e.id, index)
  events.push(e)

  // broadcast to all clients
  for (const c of clients.values()) c.onNewEvent(e)

  return true
}

export class LocalRelayClient {
  // eslint-disable-next-line
  private subs: Set<any>
  // eslint-disable-next-line
  private onSend: (msg: any) => void

  private buffer: string[] = []

  private started = false

  readonly id: string

  // eslint-disable-next-line
  constructor(onSend: (msg: any) => void) {
    // eslint-disable-next-line
    this.subs = new Set<any>()
    this.onSend = onSend

    this.id = Math.random() + ''
    clients.set(this.id, this)

    this.started = started
  }
  start() {
    this.started = true
    for (const message of this.buffer) this.handle(message)
    this.buffer.length = 0
  }
  cleanup() {
    for (const subId of this.subs) {
      this.removeSub(subId)
    }
    clients.delete(this.id)
  }
  // eslint-disable-next-line
  addSub(subId: string, filters: any) {
    subs.set(subId, { instance: this, filters })
    this.subs.add(subId)
  }
  removeSub(subId: string) {
    subs.delete(subId)
    this.subs.delete(subId)
  }
  // eslint-disable-next-line
  send(message: any) {
    this.onSend(message)
  }
  handle(message: string) {
    if (!this.started) {
      this.buffer.push(message)
      return
    }

    try {
      message = JSON.parse(message)
    } catch (e) {
      this.send(['NOTICE', '', 'Unable to parse message'])
    }

    let verb: string = ''
    // eslint-disable-next-line
    let payload: Array<any> = []
    try {
      ;[verb, ...payload] = message
    } catch (e) {
      this.send(['NOTICE', '', 'Unable to read message'])
    }

    // eslint-disable-next-line
    // @ts-ignore
    const handler = this[`on${verb}`]

    if (handler) {
      handler.call(this, ...payload)
    } else {
      this.send(['NOTICE', '', 'Unable to handle message'])
    }
  }
  onCLOSE(subId: string) {
    this.removeSub(subId)
  }
  // eslint-disable-next-line
  onREQ(subId: string, ...filters: any[]) {
    const start = Date.now()
    console.log(start, 'REQ', subId, filters)

    this.addSub(subId, filters)

    const resultFilters = new Map<string, Set<number>>()
    const results: NostrEvent[] = []

    // eslint-disable-next-line
    const matchAppend = (filter: any, filterIndex: number, e: NostrEvent) => {
      if (!e) return

      try {
        if (!matchFilter(filter, e)) return
      } catch {
        console.log('invalid event?', e)
        return
      }

      if (!resultFilters.has(e.id)) {
        resultFilters.set(e.id, new Set())
        results.push(e)
      }
      resultFilters.get(e.id)?.add(filterIndex)
    }

    for (let filterIndex = 0; filterIndex < filters.length; filterIndex++) {
      const filter = filters[filterIndex]
      if (filter.ids?.length) {
        for (const id of filter.ids) {
          const index = eventById.get(id)
          if (index === undefined) continue
          const e = events[index]
          matchAppend(filter, filterIndex, e)
        }
      } else if (filter.kinds?.length && filter.authors?.length) {
        for (const kind of filter.kinds) {
          for (const pubkey of filter.authors) {
            const key = kind + ':' + pubkey
            const indexes = eventsByAuthorKind.get(key)
            if (!indexes) continue
            for (const i of indexes) {
              const e = events[i]
              matchAppend(filter, filterIndex, e)
            }
          }
        }
      } else if (filter.kinds?.length) {
        for (const kind of filter.kinds) {
          const key = kind + ''
          const indexes = eventsByKind.get(key)
          if (!indexes) continue
          for (const i of indexes) {
            const e = events[i]
            matchAppend(filter, filterIndex, e)
          }
        }
      } else {
        for (const e of events) matchAppend(filter, filterIndex, e)
      }
    }

    //     for (const event of events) {
    //       if (matchFilters(filters, event)) {
    // //        console.log('match', subId, event)

    //         this.send(['EVENT', subId, event])
    //       } else {
    // //        console.log('miss', subId, event)
    //       }
    //     }

    // sort all results by timestamp
    results.sort((a, b) => b.created_at - a.created_at)

    // send as much as each filter-limit required
    const filterCounts = new Array(filters.length).fill(0)
    let sent = 0
    for (const e of results) {
      const filterIndexes = resultFilters.get(e.id)
      if (!filterIndexes) throw new Error('Impossible')
      //      console.log("event", e.id, "filterIndexes", filterIndexes)

      // check if this event fits one of it's matching filters' limits
      let send = false
      for (const filterIndex of filterIndexes) {
        const filter = filters[filterIndex]
        const limit = Math.min(filter.limit || 3000, 3000)
        const count = filterCounts[filterIndex]
        if (count < limit) {
          filterCounts[filterIndex]++
          send = true
        }
      }

      if (send) {
        this.send(['EVENT', subId, e])
        sent++
      }
    }

    console.log(Date.now(), 'REQ EOSE done in ', Date.now() - start, 'sent', sent, 'results', results.length)

    this.send(['EOSE', subId])
  }
  onEVENT(event: NostrEvent) {
    // this method will broadcast the added
    // event to all clients, including this one
    const added = addLocalRelayEvent(event)

    console.log('EVENT', event, added)

    this.send(['OK', event.id])
  }
  onNewEvent(event: NostrEvent) {
    for (const [subId, { instance, filters }] of subs.entries()) {
      if (matchFilters(filters, event)) {
        console.log('new match', subId, event)

        instance.send(['EVENT', subId, event])
      }
    }
  }
}

// eslint-disable-next-line
export function createLocalRelayClient(onReply: (msg: any) => void): string {
  const client = new LocalRelayClient(onReply)
  return client.id
}

export function localRelayHandle(id: string, data: string) {
  const client = clients.get(id)
  client?.handle(data)
}

export function localRelayDestroy(id: string) {
  const client = clients.get(id)
  client?.cleanup()
}

export async function initLocalRelay() {
  const start = Date.now()
  const dbEvents = await dbi.listLocalRelayEvents()
  for (const e of dbEvents) addLocalRelayEvent(e, true)
  console.log('local events', events.length, 'loaded in', Date.now() - start, 'ms')
  started = true
  for (const c of clients.values()) c.start()
}

export function getEventsCount() {
  return events.length
}

export function getEventStats() {
  const kinds = new Map<number, number>()
  const pubkeys = new Map<number, number>()
  for (const e of events) {
    const k = (kinds.get(e.kind) || 0) + 1
    const p = (pubkeys.get(e.pubkey) || 0) + 1
    kinds.set(e.kind, k)
    pubkeys.set(e.pubkey, p)
  }

  return {
    kinds: [...kinds.entries()],
    pubkeys: [...pubkeys.entries()]
  }
}
