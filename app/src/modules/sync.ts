import {
  NDKFilter,
  NDKRelaySet,
  NostrEvent
  // @ts-ignore
} from '@nostrband/ndk'
// @ts-ignore
import { nip19 } from '@nostrband/nostr-tools'
// @ts-ignore
import { decode as bolt11Decode } from 'light-bolt11-decoder'
import { getTagValue, getTags, ndk, nostrEvent } from './nostr'
import { readRelays } from './const/relays'
import { LocalRelayClient, addLocalRelayEvent, getEventsCount } from './relay'
import { dbi } from './db'
import { v4 } from 'uuid'
import { Kinds } from './const/kinds'
import { MIN_ZAP_AMOUNT } from '@/consts'

interface ISyncTask {
  id: string
  pubkey: string
  type: string
  since: number
  until: number
  params: any
}

export interface ISyncState {
  todo: number,
  done: number
  totalEventCount: number
  newEventCount: number
}

let currentTask: (ISyncTask | undefined) = undefined
let currentPubkey = ""
let currentContactList: NostrEvent | null = null
const queue: ISyncTask[] = []
const newEvents: NostrEvent[] = []
let done = 0
let newEventCount = 0
let onSyncState: ((s: ISyncState) => void) | null = null

function createTask(type: string, params: any, since?: number, until?: number): ISyncTask {
  console.log("sync createTask", currentPubkey, type, "since", since, 
    "until", until, "params", params)
  return {
    id: v4(),
    pubkey: currentPubkey,
    type,
    params,
    since: since || 0,
    until: until || Math.floor(Date.now() / 1000)
  }
}

async function appendTasks(tasks: ISyncTask[], taskQueue: ISyncTask[]) {
  await dbi.putSyncTasks(tasks)
  taskQueue.push(...tasks)
} 

function updateSyncState() {
  if (onSyncState) onSyncState({
    todo: queue.length + (currentTask ? 1 : 0),
    done,
    totalEventCount: getEventsCount(),
    newEventCount
  })
}


export function onBeforeNewEvent(event: NostrEvent) {
  switch (event.kind as number) {
    case Kinds.CONTACT_LIST:
      newEvents.push(event)
      break
  }
}

function getContacts(event: NostrEvent): Set<string> {
  return new Set(
    getTags(event, 'p')
      .map(t => t.length >= 2 ? t[1] : '')
      .filter(p => p.length === 64)
  )
}

async function getExistingContactList(pubkey: string): Promise<NostrEvent | null> {
  const contactLists = await fetchLocal({ authors: [pubkey], kinds: [Kinds.CONTACT_LIST] })
  console.log("sync", pubkey, "contactList", contactLists)
  if (contactLists.length === 0) return null
  return contactLists[0]
}

function getContactPubkeys(contactList: NostrEvent | null) {
  if (!contactList) return []

  const contactSet = getContacts(currentContactList)
  contactSet.delete(contactList.pubkey)
  return [...contactSet.values()]
}

async function createAppsTasks(since: number, until?: number): Promise<ISyncTask[]> {
  const task = createTask('apps', {}, since, until)
  return [task]
}

async function createPubkeyTasks(pubkeys: string[], since: number, until?: number): Promise<ISyncTask[]> {

  const newQueue: ISyncTask[] = []

  let pubkeyBatch: string[] = []
  async function pushPubkeyBatch() {
    if (pubkeyBatch.length === 0) return
    const task = createTask('pubkeys', {
      pubkeys: pubkeyBatch
    }, since, until)
    newQueue.push(task)
    pubkeyBatch = []
  }

  for (const p of pubkeys) {
    pubkeyBatch.push(p)
    if (pubkeyBatch.length >= 500)
      await pushPubkeyBatch()
  }
  await pushPubkeyBatch()

  return newQueue
}

async function processNewEvents() {
  if (!currentPubkey) {
    // clear the queue, we're not interested until
    // we have an active sync in progress
    newEvents.length = 0
    return
  }

  if (newEvents.length)
    console.log("sync processing new events", newEvents.length)
  while (newEvents.length > 0) {
    const event = newEvents.shift()

    // new contact list of the current user
    if (event.pubkey === currentPubkey 
      && event.kind === Kinds.CONTACT_LIST
      && event.created_at > (currentContactList?.created_at || 0)
    ) {
      const newContacts = getContacts(event)
      newContacts.delete(currentPubkey)

      const contacts = new Set(getContactPubkeys(currentContactList))

      const newPubkeys = [...newContacts.values()].filter(p => !contacts.has(p))
      console.log("sync existingContacts", contacts.size, "newContacts", newContacts.size, 
        "newPubkeys", newPubkeys.length)

      const [sinceOld, sinceNew] = getInitSyncRanges()
      const createTasks = async (since: number, until?: number) => { 
        const pubkeyTasks = await createPubkeyTasks(newPubkeys, since, until)
        appendTasks(pubkeyTasks, queue)
      }

      createTasks(sinceNew)
      createTasks(sinceOld, sinceNew+1)

      updateSyncState()

      currentContactList = event
    }
  }
}

async function processFilter(
  task: ISyncTask, filterTmpl: NDKFilter, postFilter?: (e: NostrEvent) => boolean
) {
  let totalLimit = 4000

  // FIXME use trust rank to calc per-pubkey limit?
  if (filterTmpl.authors?.length > 0)
    totalLimit = filterTmpl.authors.length * 100
  if (filterTmpl.authors?.includes(currentPubkey))
    totalLimit *= 50

  let total = 0
  let count = 0
  let nextUntil = task.until
  let lastUntil = 0
  let lastUpdate = 0
  do {
    lastUntil = nextUntil
    count = 0

    const filter: NDKFilter = {
      ...filterTmpl,
      since: task.since,
      until: lastUntil,
      limit: 2000,
    }

    const start = Date.now()
    const events = await ndk.fetchEvents(
      filter, {}, NDKRelaySet.fromRelayUrls(readRelays, ndk))
    const newEvents = []
    for (const ndkEvent of events.values()) {
      const e = nostrEvent(ndkEvent)
      if (postFilter && !postFilter(e)) continue
      const added = addLocalRelayEvent(e)
      if (added) newEvents.push(e)
      //console.log("sync event", e.kind, e.id, e.pubkey, added)
      nextUntil = Math.min(e.created_at, nextUntil)
      ++count
    }

    if (newEvents.length > 0)
      dbi.putLocalRelayEvents(newEvents)

    total += count
    newEventCount += count

    const now = Date.now()
    console.log("sync task step events", count, "total", total, 
      "in", now - start, "ms", filter)

    if ((now - lastUpdate) > 10000) {
      updateSyncState()
      lastUpdate = now
    }

  } while (nextUntil < lastUntil && total < totalLimit && nextUntil > task.since)
}

function filterBigZap(e: NostrEvent) {
  try {
    e.bolt11 = bolt11Decode(getTagValue(e, 'bolt11'))
  } catch {
    e.bolt11 = undefined
  }
  const amountMsat = Number(e.bolt11?.sections?.find((s: any) => s.name === 'amount')?.value || '')
  return amountMsat >= MIN_ZAP_AMOUNT * 1000
}

async function processNextTask() {

  await processNewEvents()

  // recent stuff first
  queue.sort((a, b) => b.until - a.until)

  // take first
  currentTask = queue.shift()
  if (!currentTask) {
    setTimeout(processNextTask, 1000)
    return
  }
  console.log("sync task", currentTask, "todo", queue.length, "done", done)

  if (currentTask.type === 'pubkeys') {

    const rareFilter: NDKFilter = {
      authors: currentTask.params.pubkeys,
      kinds: [
        Kinds.META, 
        Kinds.CONTACT_LIST,
        Kinds.PROFILE_LIST,
        Kinds.BOOKMARKS,
        Kinds.COMMUNITY,
        Kinds.LONG_NOTE,
        Kinds.COMMUNITY_APPROVAL, 
        Kinds.HIGHLIGHT,
      ]
    }
    // major kinds excluding frequent ones like reactions
    const mainFilter: NDKFilter = {
      authors: currentTask.params.pubkeys,
      kinds: [
        Kinds.NOTE, 
        Kinds.REACTION, 
        Kinds.REPOST, 
      ]
    }
    // const allFilter: NDKFilter = {
    //   authors: task.params.pubkeys
    // }
    const zapsFilter: NDKFilter = {
      "#p": currentTask.params.pubkeys,
      kinds: [Kinds.ZAP]
    }
    const liveFilter: NDKFilter = {
      "#p": currentTask.params.pubkeys,
      kinds: [Kinds.LIVE_EVENT]
    }

    await processFilter(currentTask, rareFilter)
    await processFilter(currentTask, mainFilter)
    await processFilter(currentTask, zapsFilter, filterBigZap)
    await processFilter(currentTask, liveFilter)
//    await processFilter(task, allFilter)
  } else if (currentTask.type === 'apps') {
    const filter: NDKFilter = {
      kinds: [Kinds.APP]
    }

    await processFilter(currentTask, filter)
  }

  // delete from db by filter.id
  await dbi.deleteSyncTask(currentTask.id)

  // count it
  currentTask = undefined
  done++
  updateSyncState()

  setTimeout(processNextTask, queue.length > 0 ? 0 : 1000)
}

async function fetchLocal(filter: any): Promise<any[]> {
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

function getInitSyncRanges() {
  const sinceOld = Math.floor(Date.now() / 1000) - 30 * 24 * 3600
  const sinceNew = Math.floor(Date.now() / 1000) - 7 * 24 * 3600
  return [sinceOld, sinceNew]
}

export async function startSync(pubkey: string) {

  currentPubkey = pubkey

  // clear the queue to make processNextTask stop
  // doing any work while this method is running
  queue.length = 0

  // load existing queue for this pubkey
  const newQueue = await dbi.listSyncTasks(pubkey)

  // store to use later if new CL arrives
  currentContactList = await getExistingContactList(currentPubkey)

  const contacts = getContactPubkeys(currentContactList)

  console.log("sync", currentPubkey, "contacts", contacts)

  const appendAppsTasks = async (since: number, until?: number) => {
    const appsTasks = await createAppsTasks(since, until)
    appendTasks([...appsTasks], newQueue)
  }

  const appendPubkeyTasks = async (pubkeys: string[], since: number, until?: number) => {
    const pubkeyTasks = await createPubkeyTasks(pubkeys, since, until)
    appendTasks([...pubkeyTasks], newQueue)
  }

  // last cursor
  const now = Math.floor(Date.now() / 1000)
  const lastUntil = Number(await dbi.getFlag(currentPubkey, 'last_until') || '0')

  if (lastUntil) {
    const since = lastUntil - 1 // bcs since/until are excluding
    console.log("sync", currentPubkey, "lastUntil", lastUntil, "since", since)
  
    // create tasks for known pubkeys
    appendAppsTasks(since)
    appendPubkeyTasks([currentPubkey], since)
    appendPubkeyTasks(contacts, since)
  } else {
    // for initial sync, create two tasks, one for the last week
    // and one for the rest of it, to make sure the first week 
    // loads faster
    const [sinceOld, sinceNew] = getInitSyncRanges()

    console.log("sync initial", currentPubkey, "sinceOld", sinceOld, "sinceNew", sinceNew)

    // order is important, the first one might get picked up before
    // the second one is added
    // load all apps
    appendAppsTasks(0)
    // load recent events of current pubkey
    appendPubkeyTasks([currentPubkey], sinceNew) // (sinceNew, now)
    // load recent events of contacts
    appendPubkeyTasks(contacts, sinceNew) // (sinceNew, now)
    // load ALL events of current pubkey
    appendPubkeyTasks([currentPubkey], 0, sinceNew+1) // (sinceNew, now)
    // load last month of events of contacts
    appendPubkeyTasks(contacts, sinceOld, sinceNew+1) // (sinceOld, sinceNew]
  }

  // write new lastUntil as now
  await dbi.setFlag(currentPubkey, 'last_until', now + '')

  // replace current queue with this pubkey's queue
  queue.push(...newQueue)
  done = 0

  // notify
  updateSyncState()
}

export async function resync(pubkey: string) {
  await dbi.setFlag(currentPubkey, 'last_until', '')
  startSync(pubkey)
}

export function setOnSyncState(cb: (state: ISyncState) => void) {
  onSyncState = cb
}

// launch the sync looper
setTimeout(processNextTask, 1000)
