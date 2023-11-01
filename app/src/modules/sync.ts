import { 
  NDKFilter, 
// @ts-ignore
} from '@nostrband/ndk'
// @ts-ignore
import { nip19 } from '@nostrband/nostr-tools'
import { getTags, ndk } from './nostr'
import { readRelays } from './const/relays'
import { LocalRelayClient, addLocalRelayEvent } from './relay'
import { dbi } from './db'
import { v4 } from 'uuid'
import { Kinds } from './const/kinds'

interface ISyncFilter {
  id: string
  pubkey: string
  filter: NDKFilter
  since: number
  until: number
}

// const ALL_KINDS = [
//   Kinds.META,
//   Kinds.NOTE, 
//   Kinds.LONG_NOTE, 
//   Kinds.CONTACT_LIST,
// ]

let currentPubkey = ""
const queue: ISyncFilter[] = []

function createFilter(filter: NDKFilter, since?: number): ISyncFilter {
  return {
    id: v4(),
    pubkey: currentPubkey,
    filter,
    since: since || 0,
    until: Math.floor(Date.now() / 1000)
  }
}

export async function addSyncPubkey(pubkey: string) {
  // generate filters for since: 0 until: now
  const filters = []

  // list all filters for this pubkey
  // separate filters for Meta and CL to make sure 
  // we fetch them even if they were updated long ago
  filters.push(createFilter({
    kinds: [Kinds.META, Kinds.CONTACT_LIST],
    authors: [pubkey]
  }))
  filters.push(createFilter({
    authors: [pubkey]
  }))

  // add to queue and write to disk
  for (const f of filters) {
    queue.push(f)
    dbi.putSyncQueue(f)
  }
}

async function processNextFilter() {

  // recent stuff first
  queue.sort((a, b) => b.until - a.until)

  // take first
  const syncFilter = queue.shift()
  console.log("syncFilter", syncFilter)
  if (!syncFilter) {
    setTimeout(processNextFilter, 1000)
    return
  }

  // FIXME use trust rank to calc per-pubkey limit
  const TOTAL_LIMIT = 3000
  let until = syncFilter.until

  let total = 0
  let count = 0
  do {
    const filter: NDKFilter = {
      ...syncFilter?.filter,
      since: syncFilter.since,
      until,
      limit: 1000,
    }

    const events = await ndk.fetchEvents(filter, {}, readRelays)
    for (const e of events.values()) {
      addLocalRelayEvent(e)
      until = Math.min(e.created_at, until)
      ++count
    }
    total += count
    console.log("syncFilter events", count, "total", total, filter)

  } while (count > 0 && total < TOTAL_LIMIT && until > syncFilter.since)

  // FIXME delete from db by filter.id

  setTimeout(processNextFilter, queue.length > 0 ? 0 : 1000)
}

export async function startSync(pubkey: string) {

  currentPubkey = pubkey

  // load existing queue for this pubkey
  const newQueue = await dbi.listSyncQueue(pubkey)

  // local relay direct client
  let fetchQueue: any[] = []
  let fetchOk: (() => void) | null = null
  const client = new LocalRelayClient((msg: any) => {
    console.log("local relay reply", msg)
    if (msg.length < 2) return
    if (msg[0] === "EVENT" && msg.length >= 3)
      fetchQueue.push(msg[2])
    else if (msg[0] === "EOSE")
      fetchOk?.()
    else
      console.log("bad local reply")
  })

  function fetch(filter: any): Promise<any[]> {
    return new Promise((ok) => {
      fetchOk = () => {
        const close = ["CLOSE", "1"]
        client.handle(JSON.stringify(close))  
        const events = fetchQueue
        fetchQueue = []
        ok(events)
      }
      const msg = ["REQ", "1", filter]
      client.handle(JSON.stringify(msg))
    })
  }

  const pubkeys: string[] = [currentPubkey]
  const contactLists = await fetch({authors: [pubkey], kinds: [Kinds.CONTACT_LIST]})
  console.log("sync", currentPubkey, "contactList", contactLists)
  if (contactLists.length > 0) {
    const contacts = new Set(
      getTags(contactLists[0], 'p')
      .map(t => t.length >= 2 ? t[1] : '')
      .filter(p => p.length === 64)
    )
    contacts.delete(currentPubkey)
    pubkeys.push(...contacts.values())
  }
  console.log("sync", currentPubkey, "pubkeys", pubkeys)

  let pubkeyBatch: string[] = []
  async function pushPubkeyBatch(since: number) {
    const filter = createFilter({
      authors: pubkeyBatch
    }, since)
    newQueue.push(filter)
    await dbi.putSyncQueue(filter)
    pubkeyBatch = []
  }

  async function createPubkeyFilters(pubkeys: string[], since: number) {
    for (const p of pubkeys) {
      pubkeyBatch.push(p)
      if (pubkeyBatch.length >= 100) 
        await pushPubkeyBatch(since)
    }
    await pushPubkeyBatch(since)
  }

  // last cursor
  const now = Math.floor(Date.now() / 1000)
  const lastUntil = Number(await dbi.getFlag(currentPubkey, 'last_until') || '0')

  // create filters for known pubkeys
  await createPubkeyFilters(pubkeys, lastUntil - 1)

  // write new lastUntil as now
  await dbi.setFlag(currentPubkey, 'last_until', now+'')

  // replace current queue with this pubkey's queue
  queue.length = 0
  queue.push(...newQueue)
}

// launch the sync looper
setTimeout(processNextFilter, 1000)
