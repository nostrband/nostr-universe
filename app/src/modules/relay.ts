// @ts-nocheck
import { matchFilters } from '@nostrband/nostr-tools'
import { dbi } from './db'

let events = []
let eventIds = new Set<string>()
let subs = new Map<string, any>()

export function addLocalRelayEvent(e) {
  if (!eventIds.has(e.id)) {
    eventIds.add(e.id)
    events.unshift(e)
    return true
  }
  return false
}

export class LocalRelayClient {
  constructor(onSend) {
    this._subs = new Set()
    this._onSend = onSend
  }
  cleanup() {
    for (const subId of this._subs) {
      this.removeSub(subId)
    }
  }
  addSub(subId, filters) {
    subs.set(subId, {instance: this, filters})
    this._subs.add(subId)
  }
  removeSub(subId) {
    subs.delete(subId)
    this._subs.delete(subId)
  }
  send(message) {
    this._onSend(message)
  }
  handle(message) {
    try {
      message = JSON.parse(message)
    } catch (e) {
      this.send(['NOTICE', '', 'Unable to parse message'])
    }

    let verb, payload
    try {
      [verb, ...payload] = message
    } catch (e) {
      this.send(['NOTICE', '', 'Unable to read message'])
    }

    const handler = this[`on${verb}`]

    if (handler) {
      handler.call(this, ...payload)
    } else {
      this.send(['NOTICE', '', 'Unable to handle message'])
    }
  }
  onCLOSE(subId) {
    this.removeSub(subId)
  }
  onREQ(subId, ...filters) {
    console.log('REQ', subId, ...filters)

    this.addSub(subId, filters)

    for (const event of events) {
      if (matchFilters(filters, event)) {
//        console.log('match', subId, event)

        this.send(['EVENT', subId, event])
      } else {
//        console.log('miss', subId, event)
      }
    }

    console.log('EOSE')

    this.send(['EOSE', subId])
  }
  onEVENT(event) {
    const added = addLocalRelayEvent(event)

    console.log('EVENT', event, true)

    this.send(['OK', event.id])

    if (!added) return

    for (const [subId, {instance, filters}] of subs.entries()) {
      if (matchFilters(filters, event)) {
        console.log('new match', subId, event)

        instance.send(['EVENT', subId, event])
      }
    }
  }
}

async function init() {
  events = await dbi.listLocalRelayEvents()
  console.log("local events", events.length)
}
init()
