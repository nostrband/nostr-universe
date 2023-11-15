/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  NDKFilter,
  NDKRelaySet,
  NostrEvent
  // @ts-ignore
} from '@nostrband/ndk'
// @ts-ignore
import { decode as bolt11Decode } from 'light-bolt11-decoder'
import { getTagValue, getTags, ndk, nostrEvent } from './nostr'
import { nostrbandRelay, readRelays } from './const/relays'
import { LocalRelayClient, addLocalRelayEvent, getEventsCount } from './relay'
import { dbi } from './db'
import { v4 } from 'uuid'
import { Kinds } from './const/kinds'
import { MIN_ZAP_AMOUNT } from '@/consts'
import { isGuest } from '@/utils/helpers/prepare-data'

export const enum Types {
  APPS = 'apps',
  PUBKEYS = 'pubkeys',
  METAS = 'metas'
}

interface ISyncTask {
  id: string
  pubkey: string
  type: string
  since: number
  until: number
  relay: string
  order: number
  params: any
}

export interface ISyncState {
  todo: number
  done: number
  totalEventCount: number
  newEventCount: number
  reload?: boolean
}

const MAX_ACTIVE_TASKS = 5
const activeTasks = new Map<string, { relay: string; promise: Promise<void> }>()
let currentPubkey = ''
let currentContactList: NostrEvent | null = null
const queue: ISyncTask[] = []
const newEvents: NostrEvent[] = []
let done = 0
let newEventCount = 0
let onSyncState: ((s: ISyncState) => void) | null = null
let nextOrder = 0
let needReload = false
//const logs: string[] = []

function createTask(type: string, params: any, relay: string, since?: number, until?: number): ISyncTask {
  console.log('sync createTask', currentPubkey, type, relay, 'since', since, 'until', until, 'params', params)
  nextOrder++
  return {
    id: v4(),
    pubkey: currentPubkey,
    type,
    params,
    relay,
    order: nextOrder,
    since: since || 0,
    until: until || Math.floor(Date.now() / 1000)
  }
}

async function appendTasks(tasks: ISyncTask[], taskQueue: ISyncTask[]) {
  await dbi.putSyncTasks(tasks)
  taskQueue.push(...tasks)
}

function updateSyncState() {
  const state = {
    todo: queue.length + activeTasks.size,
    done,
    totalEventCount: getEventsCount(),
    newEventCount,
    reload: needReload
  }
  console.log('sync updated state', state)
  if (onSyncState) onSyncState(state)
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
      .map((t) => (t.length >= 2 ? t[1] : ''))
      .filter((p) => p.length === 64)
  )
}

async function getExistingContactList(pubkey: string): Promise<NostrEvent | null> {
  const contactLists = await fetchLocal({ authors: [pubkey], kinds: [Kinds.CONTACT_LIST] })
  console.log('sync', pubkey, 'contactList', contactLists)
  if (contactLists.length === 0) return null
  return contactLists[0]
}

function getContactPubkeys(contactList: NostrEvent | null) {
  if (!contactList) return []

  const contactSet = getContacts(currentContactList)
  contactSet.delete(contactList.pubkey)
  return [...contactSet.values()]
}

function createAppsTasks(since: number, until?: number): ISyncTask[] {
  const tasks: ISyncTask[] = []
  for (const relay of readRelays) {
    const task = createTask('apps', {}, relay, since, until)
    tasks.push(task)
  }
  return tasks
}

function createPubkeyTasks(type: string, pubkeys: string[], since: number, until?: number): ISyncTask[] {
  const newQueue: ISyncTask[] = []

  let pubkeyBatch: string[] = []
  function pushPubkeyBatch() {
    if (pubkeyBatch.length === 0) return
    for (const relay of readRelays) {
      const task = createTask(
        type,
        {
          pubkeys: pubkeyBatch
        },
        relay,
        since,
        until
      )
      newQueue.push(task)
    }
    pubkeyBatch = []
  }

  for (const p of pubkeys) {
    pubkeyBatch.push(p)
    if (pubkeyBatch.length >= 500) pushPubkeyBatch()
  }
  pushPubkeyBatch()

  return newQueue
}

async function processNewEvents() {
  if (!currentPubkey) {
    // clear the queue, we're not interested until
    // we have an active sync in progress
    newEvents.length = 0
    return
  }

  if (newEvents.length) console.log('sync processing new events', newEvents.length)
  while (newEvents.length > 0) {
    const event = newEvents.shift()

    // new contact list of the current user
    if (
      event.pubkey === currentPubkey &&
      event.kind === Kinds.CONTACT_LIST &&
      event.created_at > (currentContactList?.created_at || 0)
    ) {
      const newContacts = getContacts(event)
      newContacts.delete(currentPubkey)

      const contacts = new Set(getContactPubkeys(currentContactList))

      const newPubkeys = [...newContacts.values()].filter((p) => !contacts.has(p))
      console.log(
        'sync existingContacts',
        contacts.size,
        'newContacts',
        newContacts.size,
        'newPubkeys',
        newPubkeys.length
      )

      const [sinceOld, sinceNew] = getInitSyncRanges()

      const now = Math.floor(Date.now() / 1000)

      // we need metas no matter how old!
      const metaTasks = createPubkeyTasks(Types.METAS, newPubkeys, 0, now)
      // recent stuff
      const pubkeyTasksNew = createPubkeyTasks(Types.PUBKEYS, newPubkeys, sinceNew, now)
      // and then older stuff
      const pubkeyTasksOld = createPubkeyTasks(Types.PUBKEYS, newPubkeys, sinceOld, sinceNew + 1)

      // append in proper order
      await appendTasks([...metaTasks, ...pubkeyTasksNew, ...pubkeyTasksOld], queue)

      // notify
      updateSyncState()

      // remember our current CL
      currentContactList = event
    }
  }
}

async function processFilters(task: ISyncTask, filterTmpls: NDKFilter[], postFilter?: (e: NostrEvent) => boolean) {
  const DEFAULT_LIMIT = 4000

  // FIXME use trust rank to calc per-pubkey limit?
  let totalLimit = 0
  for (const filter of filterTmpls) {
    let limit = DEFAULT_LIMIT
    if (filter.authors?.length > 0) limit = filter.authors.length * 100
    //    if (filter.authors?.includes(currentPubkey))
    //      limit *= 50
    totalLimit += limit
  }

  let total = 0
  let count = 0
  let nextUntil = task.until
  let lastUntil = 0
  let lastUpdate = 0
  const results: NostrEvent[] = []
  do {
    lastUntil = nextUntil
    count = 0

    const filters: NDKFilter[] = []
    for (const filterTmpl of filterTmpls) {
      const filter: NDKFilter = {
        ...filterTmpl,
        since: task.since,
        until: lastUntil,
        limit: 4000
      }
      filters.push(filter)
    }

    // const sub = new NDKSubscription(
    //   ndk,
    //   filters,
    //   { subId: task.id, closeOnEose: true },
    //   NDKRelaySet.fromRelayUrls([task.relay || nostrbandRelay], ndk)
    // )
    // const events: NostrEvent[] = []
    // sub.on('event', (e: NostrEvent) => events.push(e))
    // sub.start()

    // await new Promise(ok => sub.on('eose', ok))

    const start = Date.now()
    const events = await ndk.fetchEvents(
      filters,
      { subId: task.id },
      NDKRelaySet.fromRelayUrls([task.relay || nostrbandRelay], ndk)
    )
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

    if (newEvents.length > 0) dbi.putLocalRelayEvents(newEvents)

    results.push(...newEvents)
    total += count
    newEventCount += count

    const now = Date.now()
    console.log(
      'sync task step events',
      count, //"mismatched", mismatched,
      'total',
      total,
      'totalLimit',
      totalLimit,
      'relay',
      task.relay,
      'in',
      now - start,
      'ms',
      filters
    )
    //    logs.push(`got ${count} from ${task.relay} in ${now - start} total ${total} kinds ${JSON.stringify(filter.kinds)}`)

    if (now - lastUpdate > 10000) {
      updateSyncState()
      lastUpdate = now
    }

    // let other stuff work too
    await new Promise((ok) => setTimeout(ok, 2000))
  } while (nextUntil < lastUntil && total < totalLimit && nextUntil > task.since)

  return results
}

function filterBigZap(e: NostrEvent) {
  if (e.kind !== Kinds.ZAP) return true
  try {
    e.bolt11 = bolt11Decode(getTagValue(e, 'bolt11'))
  } catch {
    e.bolt11 = undefined
  }
  const amountMsat = Number(e.bolt11?.sections?.find((s: any) => s.name === 'amount')?.value || '')
  return amountMsat >= MIN_ZAP_AMOUNT * 1000
}

async function executeTaskPubkeys(currentTask: ISyncTask) {
  const rareFilter: NDKFilter = {
    authors: currentTask.params.pubkeys,
    kinds: [
      Kinds.LONG_NOTE,
      Kinds.COMMUNITY_APPROVAL,
      Kinds.HIGHLIGHT,
      Kinds.PROFILE_LIST,
      Kinds.BOOKMARKS,
      Kinds.COMMUNITY
    ]
  }
  // frequent kinds
  const mainFilter: NDKFilter = {
    authors: currentTask.params.pubkeys,
    kinds: [Kinds.NOTE, Kinds.REPOST, Kinds.REPORT, Kinds.LABEL, Kinds.REACTION, Kinds.DELETE]
  }

  const refFilter: NDKFilter = {
    '#p': currentTask.params.pubkeys,
    kinds: [Kinds.ZAP, Kinds.LIVE_EVENT]
  }

  // all filters at once cause strfry to slow down
  // and get cut off by the read timeout :(
  // await processFilters(currentTask,
  //   [rareFilter, mainFilter, refFilter],
  //   filterBigZap)

  await processFilters(currentTask, [rareFilter, refFilter], filterBigZap)
  await processFilters(currentTask, [mainFilter])

  // all filters separately cause nostr.band to rate limit :(
  // await processFilters(currentTask, [rareFilter])
  // await processFilters(currentTask, [mainFilter])
  // await processFilters(currentTask, [refFilter], filterBigZap)
}

async function executeTaskMetas(currentTask: ISyncTask) {
  const filter: NDKFilter = {
    authors: currentTask.params.pubkeys,
    kinds: [Kinds.META, Kinds.CONTACT_LIST]
  }

  await processFilters(currentTask, [filter])
}

async function executeTaskApps(currentTask: ISyncTask) {
  const filter: NDKFilter = {
    kinds: [Kinds.APP]
  }

  await processFilters(currentTask, [filter])
}

async function executeTask(currentTask: ISyncTask) {
  switch (currentTask.type) {
    case Types.PUBKEYS:
      await executeTaskPubkeys(currentTask)
      break

    case Types.APPS:
      await executeTaskApps(currentTask)
      break

    case Types.METAS:
      await executeTaskMetas(currentTask)
      break
  }
}

async function processNextTask() {
  await processNewEvents()
  if (!queue.length) {
    setTimeout(processNextTask, 1000)
    return
  }

  const waitOne = async () => {
    if (!activeTasks.size) return
    await Promise.race([...activeTasks.values()].map((at) => at.promise))
  }

  // wait for one of active tasks to finish
  if (activeTasks.size >= MAX_ACTIVE_TASKS) await waitOne()

  // recent stuff first
  queue.sort((a, b) => {
    if (b.until != a.until) return b.until - a.until // desc
    return a.order - b.order // asc
  })

  // take one on an idle relay
  const relays = [...activeTasks.values()].map((at) => at.relay)
  const nextIndex = queue.findIndex((t) => !relays.find((r) => r === t.relay))
  if (nextIndex < 0) {
    // wait until one task finishes and retry
    await waitOne()
    setTimeout(processNextTask, 0)
    return
  }

  // take next task
  const currentTask = queue[nextIndex]
  console.log(
    'sync task since',
    new Date(currentTask.since * 1000),
    'until',
    new Date(currentTask.until * 1000),
    currentTask,
    'todo',
    queue.length,
    'done',
    done,
    'active',
    activeTasks.size
  )
  queue.splice(nextIndex, 1)

  const promise = new Promise<void>(async (ok) => {
    // exec
    await executeTask(currentTask)

    // delete from db by filter.id
    await dbi.deleteSyncTask(currentTask.id)

    // count it
    done++
    activeTasks.delete(currentTask.id)
    console.log('sync task finished', currentTask)
    updateSyncState()
    ok()
  })

  // add the active task to list
  activeTasks.set(currentTask.id, { relay: currentTask.relay, promise })

  // schedule next check
  setTimeout(processNextTask, queue.length > 0 ? 0 : 1000)
}

async function fetchLocal(filter: any): Promise<any[]> {
  // local relay direct client
  let fetchQueue: any[] = []
  let fetchOk: (() => void) | null = null
  const client = new LocalRelayClient((msg: any) => {
    console.log('local relay reply', msg)
    if (msg.length < 2) return
    if (msg[0] === 'EVENT' && msg.length >= 3) fetchQueue.push(msg[2])
    else if (msg[0] === 'EOSE') fetchOk?.()
    else console.log('bad local reply')
  })

  return new Promise((ok) => {
    fetchOk = () => {
      const close = ['CLOSE', '1']
      client.handle(JSON.stringify(close))
      const events = fetchQueue
      fetchQueue = []
      ok(events)
    }
    const msg = ['REQ', '1', filter]
    client.handle(JSON.stringify(msg))
  })
}

function getInitSyncRanges() {
  const sinceOld = Math.floor(Date.now() / 1000) - 30 * 24 * 3600
  const sinceNew = Math.floor(Date.now() / 1000) - 7 * 24 * 3600
  return [sinceOld, sinceNew]
}

export async function startSync(pubkey: string) {
  if (currentPubkey === pubkey) return

  currentPubkey = pubkey

  // clear the queue to make processNextTask stop
  // doing any work while this method is running
  queue.length = 0

  // load existing queue for this pubkey
  const newQueue = await dbi.listSyncTasks(pubkey)

  // store to use later if new CL arrives
  currentContactList = await getExistingContactList(currentPubkey)

  const contacts = getContactPubkeys(currentContactList)

  console.log('sync', currentPubkey, 'contacts', contacts)

  const appendAppsTasks = async (since: number, until?: number) => {
    const appsTasks = createAppsTasks(since, until)
    await appendTasks(appsTasks, newQueue)
  }

  // last cursor
  const now = Math.floor(Date.now() / 1000)
  const lastUntil = Number((await dbi.getFlag(currentPubkey, 'last_until')) || '0')

  if (lastUntil) {
    const since = lastUntil - 1 // bcs since/until are excluding
    console.log(
      'sync',
      currentPubkey,
      'lastUntil',
      lastUntil,
      new Date(lastUntil * 1000),
      'since',
      since,
      new Date(since * 1000)
    )

    // apps
    await appendAppsTasks(since, now)

    // self and contacts
    if (!isGuest(currentPubkey)) {
      const myTasks = createPubkeyTasks(Types.PUBKEYS, [currentPubkey], since, now)
      const metaTasks = createPubkeyTasks(Types.METAS, [currentPubkey, ...contacts], since, now)
      const pubkeyTasks = createPubkeyTasks(Types.PUBKEYS, contacts, since, now)

      // append in proper order
      await appendTasks([...myTasks, ...metaTasks, ...pubkeyTasks], newQueue)
    }
  } else {
    // for initial sync, create two tasks, one for the last week
    // and one for the rest of it, to make sure the first week
    // loads faster
    const [sinceOld, sinceNew] = getInitSyncRanges()

    console.log('sync initial', currentPubkey, 'sinceOld', sinceOld, 'sinceNew', sinceNew)

    // order is important, the first one might get picked up before
    // the second one is added
    // load all apps
    await appendAppsTasks(0, now)

    if (!isGuest(currentPubkey)) {
      const myTasks = createPubkeyTasks(Types.PUBKEYS, [currentPubkey], sinceNew, now)
      const metaTasks = createPubkeyTasks(Types.METAS, [currentPubkey, ...contacts], sinceNew, now)
      const pubkeyTasks = createPubkeyTasks(Types.PUBKEYS, contacts, sinceNew, now)

      // load ALL events of current pubkey and ALL metas (up to a max filter limit)
      const myTasksOld = createPubkeyTasks(Types.PUBKEYS, [currentPubkey], 0, sinceNew + 1)
      const metaTasksOld = createPubkeyTasks(Types.METAS, [currentPubkey, ...contacts], 0, sinceNew + 1)
      // load last month of events of contacts
      const pubkeyTasksOld = createPubkeyTasks(Types.PUBKEYS, contacts, sinceOld, sinceNew + 1)

      // reload when we fetch all the new stuff
      needReload = true

      // append in proper order
      await appendTasks(
        [...myTasks, ...metaTasks, ...pubkeyTasks, ...myTasksOld, ...metaTasksOld, ...pubkeyTasksOld],
        newQueue
      )
    }
  }

  // write new lastUntil as now
  await dbi.setFlag(currentPubkey, 'last_until', now + '')

  // replace current queue with this pubkey's queue
  console.log('sync newQueue', newQueue.length, newQueue)
  queue.push(...newQueue)
  done = 0

  // notify
  updateSyncState()
}

export async function resync(pubkey: string) {
  await dbi.setFlag(currentPubkey, 'last_until', '')
  currentPubkey = ''
  startSync(pubkey)
}

export function setOnSyncState(cb: (state: ISyncState) => void) {
  onSyncState = cb
}

// launch the sync looper
setTimeout(processNextTask, 1000)
