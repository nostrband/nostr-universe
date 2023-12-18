/* eslint-disable @typescript-eslint/ban-ts-comment */
import NDK, {
  NDKRelaySet,
  NDKRelay,
  NDKEvent,
  NDKFilter,
  NDKNip07Signer,
  NDKNip46Signer,
  NDKSubscription,
  NostrEvent,
  NostrTop,
  NDKUser
  // @ts-ignore
} from '@nostrband/ndk'
import { getEventHash, nip19 } from '@nostrband/nostr-tools'
// @ts-ignore
import { decode as bolt11Decode } from 'light-bolt11-decoder'
import { walletstore } from './walletstore'
import { AuthoredEvent, createAuthoredEvent } from '@/types/authored-event'
import { AugmentedEvent, createEvent } from '@/types/augmented-event'
import { MetaEvent, createMetaEvent } from '@/types/meta-event'
import { Meta, createMeta } from '@/types/meta'
import { ZapEvent, createZapEvent } from '@/types/zap-event'
import {
  CommunityApprovalInfo,
  CommunityEvent,
  ExtendedCommunityEvent,
  createCommunityApprovalInfo,
  createCommunityEvent,
  createExtendedCommunityEvent
} from '@/types/communities'
import { LongNoteEvent, createLongNoteEvent } from '@/types/long-note-event'
import { HighlightEvent, createHighlightEvent } from '@/types/highlight-event'
import { LiveEvent, createLiveEvent } from '@/types/live-events'
import { WalletInfo } from '@/types/wallet-info'
import { ContactListEvent, createContactListEvent } from '@/types/contact-list-event'
import { AppNostr } from '@/types/app-nostr'
import { showToast } from '@/utils/helpers/general'
import { AppEvent, AppUrl, createAppEvent } from '@/types/app-event'
import { NATIVE_NADDR } from '@/consts'
import { ReactionTargetEvent, createReactionTargetEvent } from '@/types/reaction-target-event'
import { EventAddr } from '@/types/event-addr'
import { ProfileListEvent, createProfileListEvent } from '@/types/profile-list-event'
import { Bookmark, BookmarkListEvent, createBookmarkListEvent } from '@/types/bookmark-list-event'
import { dbi } from './db'
import { cacheRelay, nostrbandRelay, nsbRelays, allRelays, readRelays, writeRelays } from './const/relays'
import { Kinds } from './const/kinds'
import { AppRecommEvent, createAppRecommEvent } from '@/types/app-recomm-event'

const MAX_TOP_APPS = 500

// we only care about web apps
const PLATFORMS = ['web']

const ADDR_TYPES = ['', 'npub', 'note', 'nevent', 'nprofile', 'naddr']

// global ndk instance for now
export let ndk: NDK = null
const nsbNDK: NDK = new NDK({ explicitRelayUrls: nsbRelays })
nsbNDK
  .connect(5000)
  .then(() => {
    console.log('nsb ndk connected')
  })
  .catch(() => console.log('nsb ndk connect error'))

let nsbSigner: NDKNip46Signer = null

interface App {
  app_id: string
  handlers: AppEvent[]
  kinds: number[]
  platforms: string[]
}

export interface AppInfos {
  meta: MetaEvent | null
  apps: Map<string, App>
  handlers: AppEvent[]
  kinds: number[]
  platforms: string[]
}

const kindAppsCache = new Map<number, AppInfos>()
const metaCache = new Map<string, MetaEvent>()
const eventCache = new Map<string, AugmentedEvent>()
const addrCache = new Map<string, AugmentedEvent>()

let onAddLocalRelayEvents: ((e: NostrEvent[]) => Promise<boolean[]>) | null = null

export function nostrEvent(e: NDKEvent) {
  return {
    id: e.id,
    created_at: e.created_at,
    pubkey: e.pubkey,
    kind: e.kind,
    tags: e.tags,
    content: e.content,
    sig: e.sig
  }
}

function rawEvent(e: NDKEvent): AugmentedEvent {
  return {
    ...nostrEvent(e),
    identifier: getTagValue(e, 'd'),
    order: e.created_at
  }
}

function parseContentJson(c: string): object {
  try {
    return JSON.parse(c)
  } catch (e) {
    console.log('Bad json: ', c, e)
    return {}
  }
}

export function getNprofile(pubkey: string) {
  return nip19.nprofileEncode({
    pubkey: pubkey,
    relays: [nostrbandRelay]
  })
}

export function getNevent(eventId: string) {
  return nip19.neventEncode({
    id: eventId,
    relays: [nostrbandRelay]
  })
}

export function parseProfileJson(e: NostrEvent): Meta {
  // all meta fields are optional so 'as' works fine
  const profile = createMeta(parseContentJson(e.content))
  profile.pubkey = e.pubkey
  profile.npub = nip19.npubEncode(e.pubkey)
  return profile
}

export function getEventNip19(e: NDKEvent | AugmentedEvent): string {
  if (e.kind === 0) {
    return nip19.nprofileEncode({
      pubkey: e.pubkey,
      relays: [nostrbandRelay]
    })
  } else if ((e.kind >= 10000 && e.kind < 20000) || (e.kind >= 30000 && e.kind < 40000)) {
    return nip19.naddrEncode({
      pubkey: e.pubkey,
      kind: e.kind,
      identifier: e.identifier,
      relays: [nostrbandRelay]
    })
  } else {
    return nip19.neventEncode({
      id: e.id,
      relays: [nostrbandRelay]
    })
  }
}

export function getEventAddr(e: NDKEvent | AugmentedEvent): string {
  let addr = e.id
  if (
    e.kind === Kinds.META ||
    e.kind === Kinds.CONTACT_LIST ||
    (e.kind >= 10000 && e.kind < 20000) ||
    (e.kind >= 30000 && e.kind < 40000)
  ) {
    addr = e.kind + ':' + e.pubkey + ':' + getTagValue(e, 'd')
  }
  return addr
}

interface IFetchOptions {
  cacheOnly?: boolean
  noCache?: boolean
}

function fetchEventsRead(ndk: NDK, filter: NDKFilter, options?: IFetchOptions): Promise<Set<NDKEvent>> {
  // eslint-disable-next-line
  return new Promise(async (ok) => {
    const start = Date.now()
    const relaySet = NDKRelaySet.fromRelayUrls(
      options?.cacheOnly ? [cacheRelay] : options?.noCache ? readRelays : [cacheRelay, ...readRelays],
      ndk
    )
    const skipVerification =
      options?.cacheOnly || (relaySet.relays.size === 1 && relaySet.relays.values().next().value.url === cacheRelay)
    const events = await ndk.fetchEvents(
      filter,
      {
        skipVerification
      },
      relaySet
    )
    if (!options?.cacheOnly) {
      // eslint-disable-next-line
      const aus = [...events.values()].map((e: any) => rawEvent(e))
      putEventsToCache(aus)
    }

    console.log(
      Date.now(),
      'fetched in',
      Date.now() - start,
      'ms events',
      events.size,
      'skipVerification',
      skipVerification,
      'from',
      relaySet.relays.size,
      relaySet.relays,
      'relays, options',
      options,
      filter
    )
    ok(events)
  })
}

function subscribe(ndk: NDK, filter: NDKFilter, options?: IFetchOptions): NDKSubscription {
  const relaySet = NDKRelaySet.fromRelayUrls(
    options?.cacheOnly ? [cacheRelay] : options?.noCache ? readRelays : [cacheRelay, ...readRelays],
    ndk
  )
  const skipVerification =
    options?.cacheOnly || (relaySet.relays.size === 1 && relaySet.relays.values().next().value.url === cacheRelay)
  const sub = ndk.subscribe(
    filter,
    {
      skipVerification
    },
    relaySet,
    /* autoStart */ false
  )
  if (!options?.cacheOnly) sub.on('event', (e: NDKEvent) => putEventsToCache([rawEvent(e)]))

  console.log(
    Date.now(),
    'subscribe',
    'skipVerification',
    skipVerification,
    'from',
    relaySet.relays.size,
    relaySet.relays,
    'relays, options',
    options,
    filter
  )

  return sub
}

export function getTags(e: AugmentedEvent | NDKEvent | Event | AuthoredEvent | MetaEvent, name: string): string[][] {
  return e.tags.filter((t: string[]) => t.length > 0 && t[0] === name)
}

export function getTag(
  e: AugmentedEvent | NDKEvent | Event | AuthoredEvent | MetaEvent,
  name: string
): string[] | null {
  const tags = getTags(e, name)
  if (tags.length === 0) return null
  return tags[0]
}

export function getTagValue(
  e: AugmentedEvent | NDKEvent | Event | AuthoredEvent | MetaEvent,
  name: string,
  index: number = 0,
  def: string = ''
): string {
  const tag = getTag(e, name)
  if (tag === null || !tag.length || (index && index >= tag.length)) return def
  return tag[1 + index]
}

export function getEventTagA(e: AugmentedEvent | NDKEvent | Event | AuthoredEvent | MetaEvent): string {
  let addr = e.kind + ':' + e.pubkey + ':'
  if (e.kind >= 30000 && e.kind < 40000) addr += getTagValue(e, 'd')
  return addr
}

function isWeb(e: NostrEvent): boolean {
  for (const t of e.tags) {
    if (t[0] === 'web') return true

    if (t[0] === 'android' || t[0] === 'ios' || t[0] === 'windows' || t[0] === 'macos' || t[0] === 'linux') return false
  }

  return true
}

function findHandlerUrl(e: NostrEvent, k: number) {
  for (const t of e.tags) {
    if (t[0] !== 'web' || t.length < 3) continue

    if (k === Kinds.META && (t[2] === 'npub' || t[2] === 'nprofile')) {
      return [t[1], t[2]]
    }

    if (k >= 30000 && k < 40000 && t[2] === 'naddr') {
      return [t[1], t[2]]
    }

    return [t[1], t[2]]
  }

  return null
}

function sortAsc(arr: AugmentedEvent[] | AuthoredEvent[] | MetaEvent[] | AppNostr[]) {
  arr.sort((a, b) => a.order - b.order)
}

function sortDesc(arr: AugmentedEvent[] | AuthoredEvent[] | MetaEvent[] | AppNostr[]) {
  arr.sort((a, b) => b.order - a.order)
}

export function subscribeApps() {
  const filter = {
    kinds: [Kinds.APP],
    limit: MAX_TOP_APPS
  }
  const sub = subscribe(ndk, filter, { cacheOnly: true })

  const feed = new EventFeed<AppNostr>(sub)
  feed.limit = MAX_TOP_APPS
  feed.onAugments.push(async (events: AugmentedEvent[]): Promise<AugmentedEvent[]> => {
    // load authors of the apps, we need them both for the app
    // info and for apps that inherit the author's profile info
    const profiles = await fetchMetas(events.map((e) => e.pubkey))

    events.forEach((e) => {
      e.order = Number(getTagValue(e, 'published_at'))
    })

    // convert to a convenient app object
    const apps: AppNostr[] = []
    events.forEach((e) => {
      // app author
      const author = profiles.find((p) => p.pubkey == e.pubkey)

      // app profile - it's own, or inherited from the author
      const profile = e.content ? parseProfileJson(e) : author?.profile

      // app's handled kinds and per-kind handler urls for the 'web' platform,
      // we don't add a kind that doesn't have a proper handler
      const kinds: number[] = []
      //    const handlers: { [key: string]: { url: string; type: string } } = {}
      const urls: AppUrl[] = []
      e.tags.forEach((t) => {
        let k = 0
        if (t.length < 2 || t[0] != 'k') return

        try {
          k = parseInt(t[1])
        } catch (e) {
          return
        }

        const url_type = findHandlerUrl(e, k)
        if (!url_type) return

        kinds.push(k)
        urls.push({
          url: url_type[0],
          type: url_type[1]
        })
        // handlers[k] = {
        //   url: url_type[0],
        //   type: url_type[1]
        // }
      })

      if (!isWeb(e)) return

      //    if (Object.keys(handlers).length == 0)
      //      return;

      const app: AppNostr = {
        naddr: nip19.naddrEncode({
          pubkey: e.pubkey,
          kind: e.kind,
          identifier: getTagValue(e, 'd')
        }),
        name: profile?.display_name || profile?.name || '<Noname app>',
        url: profile?.website || '',
        picture: profile?.picture || '',
        about: profile?.about || '',
        kinds,
        urls,
        order: e.order
      }

      if (app.name && app.url) apps.push(app)
    })

    //    console.log("new apps events", apps)

    // @ts-ignore
    return apps
  })

  return feed
}

export function parseAddr(id: string): EventAddr | null {
  const addr: EventAddr = {
    hex: false
  }

  try {
    const { type, data } = nip19.decode(id)

    switch (type) {
      case 'npub':
        addr.kind = 0
        addr.pubkey = data
        break
      case 'nprofile':
        addr.kind = 0
        addr.pubkey = data.pubkey
        addr.relays = data.relays
        break
      case 'note':
        addr.event_id = data
        break
      case 'nevent':
        addr.event_id = data.id
        addr.relays = data.relays
        addr.pubkey = data.author
        // FIXME add support for kind to nevent to nostr-tool
        break
      case 'naddr':
        addr.d_tag = data.identifier || ''
        addr.kind = data.kind
        addr.pubkey = data.pubkey
        addr.relays = data.relays
        break
      default:
        throw 'bad id'
    }
  } catch (e) {
    if (id.length === 64) {
      addr.event_id = id
      addr.hex = true
    } else {
      console.error('Failed to parse addr', e)
      return null
    }
  }

  return addr
}

function dedupEvents(events: NDKEvent[]): NDKEvent[] {
  const map = new Map<string, NDKEvent>()
  for (const e of events) {
    let addr: string = e.id
    if (e.kind === 0 || e.kind === 3 || (e.kind >= 10000 && e.kind < 20000) || (e.kind >= 30000 && e.kind < 40000)) {
      addr = getEventTagA(e)
    }
    const dup = map.get(addr)
    if (!dup || dup.created_at < e.created_at) {
      map.set(addr, e)
    }
  }
  return [...map.values()]
}

async function collectEvents(reqs: Promise<Set<NDKEvent>>[] | Promise<Set<NDKEvent>> | Promise<NDKEvent>) {
  const results = await Promise.allSettled(Array.isArray(reqs) ? reqs : [reqs])
  const events: NDKEvent[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') {
      if (r.value !== null) {
        if (typeof r.value[Symbol.iterator] === 'function') events.push(...r.value)
        else events.push(r.value)
      }
    }
  }
  return dedupEvents(events)
}

async function fetchEventsByAddrs(ndk: NDK, addrs: EventAddr[]): Promise<AugmentedEvent[]> {
  const ids = []
  const kindPubkeys = []
  const kindPubkeyDtags = []

  const events: AugmentedEvent[] = []
  for (const addr of addrs) {
    let id = ''
    if (addr.event_id) {
      // note, nevent
      id = addr.event_id
    } else if (addr.pubkey && addr.d_tag !== undefined && addr.kind !== undefined) {
      // naddr
      id = addr.kind + ':' + addr.pubkey + ':' + addr.d_tag
    } else if (addr.pubkey && addr.kind !== undefined) {
      // npub, nprofile
      id = addr.kind + ':' + addr.pubkey + ':'
    }

    const cachedEvent = addrCache.get(id)
    if (cachedEvent) {
      events.push({ ...cachedEvent })
      continue
    }

    if (id.includes(':')) {
      const v = id.split(':')
      if (v[2]) {
        kindPubkeyDtags.push(id)
      } else {
        kindPubkeys.push(id)
      }
    } else {
      ids.push(id)
    }
  }

  const idFilter: NDKFilter = {}
  const kindPubkeyFilter: NDKFilter = {}
  const addrFilter: NDKFilter = {}

  // NOTE: only supply addrs of same type (id/kind+pubkey/kind+pubkey+dtag)
  const addrsToFilter = (addrs: string[], filter: NDKFilter) => {
    const ids: string[] = []
    const pubkeys: string[] = []
    const kinds: number[] = []
    const dtags: string[] = []
    addrs.forEach((id) => {
      const v = id.split(':')
      if (v.length === 1) {
        ids.push(id)
      } else {
        kinds.push(Number(v[0]))
        pubkeys.push(v[1])
        if (v.length >= 3 && v[2] !== '') dtags.push(v[2])
      }
    })
    if (ids.length > 0) {
      filter.ids = [...new Set(ids)]
    } else {
      filter.authors = [...new Set(pubkeys)]
      filter.kinds = [...new Set(kinds)]
      if (dtags.length > 0) filter['#d'] = [...new Set(dtags)]
    }
  }

  addrsToFilter(ids, idFilter)
  addrsToFilter(kindPubkeys, kindPubkeyFilter)
  addrsToFilter(kindPubkeyDtags, addrFilter)

  console.log(
    'loading events by filters',
    JSON.stringify(idFilter),
    JSON.stringify(kindPubkeyFilter),
    JSON.stringify(addrFilter)
  )

  const opts = { cacheOnly: true }
  const reqs = []
  if (idFilter.ids?.length > 0) reqs.push(fetchEventsRead(ndk, idFilter, opts))
  if (kindPubkeyFilter.authors?.length > 0) reqs.push(fetchEventsRead(ndk, kindPubkeyFilter, opts))
  if (addrFilter.authors?.length > 0) reqs.push(fetchEventsRead(ndk, addrFilter, opts))

  const ndkEvents = await collectEvents(reqs)
  events.push(...[...ndkEvents].map((e) => rawEvent(e)))
  //  events.forEach((e) => putEventToCache(e))
  return events
}

export async function fetchMuteLists(pubkey: string) {
  const addrs: EventAddr[] = [
    { pubkey, kind: Kinds.MUTE_LIST },
    { pubkey, kind: Kinds.PROFILE_LIST, d_tag: 'mute' }
  ]
  return await fetchEventsByAddrs(ndk, addrs)
}

export async function fetchFullyAugmentedEventsByAddrs(
  addrs: EventAddr[],
  contactList?: string[]
): Promise<AuthoredEvent[]> {
  const augmentedEvents = await fetchEventsByAddrs(ndk, addrs)

  const kindEvents = new Map<number, AugmentedEvent[]>()
  for (const e of augmentedEvents) {
    if (!kindEvents.has(e.kind)) kindEvents.set(e.kind, [])
    const events = kindEvents.get(e.kind)
    events?.push(e)
  }

  const authoredEvens = []
  for (const [kind, events] of kindEvents.entries()) {
    // for each event, check what needs to be loaded/augmented and execute
    // load meta etc using these special augmenters
    let a = null
    switch (kind) {
      case Kinds.ZAP:
        a = await augmentZaps(events, 0)
        break
      case Kinds.COMMUNITY:
        a = await augmentCommunities(events)
        break
      case Kinds.LIVE_EVENT:
        a = await augmentLiveEvents(events, contactList || [], 1, /*ended*/ true)
        break
      case Kinds.APP:
        a = await augmentApps(events)
        break
      default:
        a = await augmentEventAuthors(events)

        switch (kind) {
          case Kinds.META:
            a = await augmentMetaEvents(a)
            break
          case Kinds.LONG_NOTE:
            a = await augmentLongNotes(a)
            break
          case Kinds.HIGHLIGHT:
            break
        }
        break
    }
    authoredEvens.push(...a)
  }

  sortDesc(authoredEvens)

  return authoredEvens
}

async function fetchEventByAddr(ndk: NDK, addr: EventAddr): Promise<AugmentedEvent | null> {
  let id = ''
  const filter: NDKFilter = {}
  if (addr.event_id) {
    // note, nevent
    filter.ids = [addr.event_id]
    id = addr.event_id
  } else if (addr.pubkey && addr.d_tag !== undefined && addr.kind !== undefined) {
    // naddr
    filter['#d'] = [addr.d_tag]
    filter.authors = [addr.pubkey]
    filter.kinds = [addr.kind]
    id = addr.kind + ':' + addr.pubkey + ':' + addr.d_tag
  } else if (addr.pubkey && addr.kind !== undefined) {
    // npub, nprofile
    filter.authors = [addr.pubkey]
    filter.kinds = [addr.kind]
    id = addr.kind + ':' + addr.pubkey + ':'
  }

  const cachedEvent = addrCache.get(id)
  if (cachedEvent) {
    console.log('event in addr cache', id)
    return { ...cachedEvent }
  }

  console.log('loading event by filter', JSON.stringify(filter))

  const opts = { cacheOnly: false }
  const reqs = [fetchEventsRead(ndk, filter, opts)]
  if (addr.hex && addr.event_id) {
    const profileFilter: NDKFilter = {
      kinds: [0],
      authors: [addr.event_id]
    }
    // console.log("loading profile by filter", profile_filter);
    reqs.push(fetchEventsRead(ndk, profileFilter, opts))
  }

  const events = await collectEvents(reqs)
  const event = events.length > 0 ? rawEvent(events[0]) : null
  //  if (event) putEventToCache(event)
  return event
}

function prepareHandlers(events: AugmentedEvent[], filterKinds: number[], metaPubkey: string = ''): AppInfos {
  const info: AppInfos = {
    meta: null,
    apps: new Map<string, App>(),
    handlers: [],
    kinds: [],
    platforms: []
  }

  const metas = new Map<string, MetaEvent>()
  for (const e of events) {
    if (e.kind === (Kinds.META as number)) {
      const [m] = augmentMetaEvents([e])
      metas.set(m.pubkey, m)

      if (metaPubkey && metaPubkey === m.pubkey) info.meta = m
    }
  }

  for (const ev of events) {
    if (ev.kind !== (Kinds.APP as number)) continue

    const e = createAppEvent(createAuthoredEvent(ev))

    // set naddr
    e.naddr = nip19.naddrEncode({
      pubkey: e.pubkey,
      kind: e.kind,
      identifier: getTagValue(e, 'd')
    })

    // init handler profile, inherit from pubkey meta if needed
    e.author = metas.get(e.pubkey)
    if (!e.content) e.meta = e.author?.profile
    else e.meta = parseProfileJson(e)

    // parse handler kinds
    const kinds = new Set<number>()
    for (const t of getTags(e, 'k')) {
      if (t.length < 2) continue
      const k = Number(t[1])
      if (k < 0 || k > 10000000 || isNaN(k)) continue
      kinds.add(k)
    }
    e.kinds = [...kinds]

    // drop handlers that don't handle our kinds
    if (filterKinds && filterKinds.length) e.kinds = e.kinds.filter((k) => filterKinds.includes(k))
    if (!e.kinds.length) continue

    // parse platforms and urls
    const ps = new Set<string>()
    e.urls = []
    for (const p of PLATFORMS) {
      // urls for platform p
      const urls = getTags(e, p)
      for (const url of urls) {
        if (url.length < 2) continue

        const type = url.length > 2 ? url[2] : ''

        // default or one of known types?
        if (type != '' && !ADDR_TYPES.find((t) => t === type)) continue

        ps.add(p)
        e.urls.push({
          url: url[1],
          type
        } as AppUrl)
      }
    }
    e.platforms = [...ps.values()]

    // dedup by app name
    e.appId = getTagValue(e, 'd')
    if (e.content !== '') e.appId = e.meta?.name || e.meta?.display_name || ''

    // init
    if (!info.apps.get(e.appId)) {
      info.apps.set(e.appId, {
        app_id: e.appId,
        handlers: [],
        kinds: [],
        platforms: []
      } as App)
    }

    // add app handler
    const app = info.apps.get(e.appId)
    if (!app) continue // impossible
    app.handlers.push(e)
    app.kinds.push(...e.kinds)
    app.platforms.push(...e.platforms)
  }

  return info
}

async function fetchAppsByKinds(ndk: NDK, kinds: number[] = []): Promise<AppInfos> {
  // fetch apps ('handlers')
  const filter: NDKFilter = {
    kinds: [Kinds.APP],
    limit: 200
  }
  if (kinds.length > 0) filter['#k'] = kinds.map((k) => '' + k)

  // load cached apps
  const ndkEvents = await fetchEventsRead(ndk, filter, { cacheOnly: true })

  const augmentedEvents = [...ndkEvents.values()].map((e) => rawEvent(e))

  // if (top)
  //   top.ids.forEach((id: string, i: number) => {
  //     const e = augmentedEvents.find((e) => e.id == id)
  //     if (e) e.order = top.ids.length - i
  //   })
  augmentedEvents.forEach((e, i) => (e.order = augmentedEvents.length - i))

  // we need profiles in case app info inherits content
  // from it's profile
  if (augmentedEvents.length > 0) {
    let pubkeys: string[] = []
    for (const e of augmentedEvents) pubkeys.push(e.pubkey)
    pubkeys = [...new Set(pubkeys)]

    const metaEvents = await fetchMetas(Object.keys(pubkeys))
    // const metasNdkEvents = await fetchEventsRead(ndk, {
    //   kinds: [Kinds.META],
    //   authors: Object.keys(pubkeys)
    // })
    //    console.log('metas', metas);

    //augmentedEvents.push(...[...metasNdkEvents.values()].map((e) => rawEvent(e)))
    augmentedEvents.push(...metaEvents)
  }

  // parse
  const info = prepareHandlers(augmentedEvents, kinds)
  return info
}

export function getHandlerEventUrl(app: AppEvent | AppNostr, ad: EventAddr): string {
  if (ad.kind === undefined) return ''

  const findUrlType = (type: string): AppUrl | undefined => {
    if (app.naddr === NATIVE_NADDR) return { type, url: 'nostr:<bech32>' }
    return app.urls?.find((u) => u.type === type)
  }

  const allUrl = findUrlType('')

  const findUrl = (id: string): string => {
    const { type } = nip19.decode(id)
    const u = findUrlType(type) || allUrl
    if (u != null) return u.url.replace('<bech32>', id)
    return ''
  }

  const naddrId: nip19.AddressPointer = {
    identifier: ad.d_tag || '',
    pubkey: ad.pubkey || '',
    kind: ad.kind,
    relays: ad.relays
  }
  const neventId: nip19.EventPointer = {
    // FIXME add kind!
    id: ad.event_id || '',
    relays: ad.relays,
    author: ad.pubkey
  }

  let url = ''
  if (ad.kind === 0) {
    if (!url && ad.pubkey)
      url =
        findUrl(nip19.npubEncode(ad.pubkey)) || findUrl(nip19.nprofileEncode({ pubkey: ad.pubkey, relays: ad.relays }))
    // || findUrl(nip19.naddrEncode(naddrId))
    if (!url && ad.event_id) url = findUrl(nip19.neventEncode(neventId)) || findUrl(nip19.noteEncode(ad.event_id))
  } else if (ad.kind === 3 || (ad.kind >= 10000 && ad.kind < 20000)) {
    // specific order - naddr preferred
    url =
      // FIXME naddr?
      findUrl(nip19.neventEncode(neventId)) || findUrl(nip19.noteEncode(ad.event_id || ''))
  } else if (ad.kind >= 30000 && ad.kind < 40000) {
    // specific order - naddr preferred
    url = findUrl(nip19.naddrEncode(naddrId))
    if (!url && ad.event_id) url = findUrl(nip19.neventEncode(neventId)) || findUrl(nip19.noteEncode(ad.event_id))
  } else {
    // specific order - naddr preferred
    url = findUrl(nip19.neventEncode(neventId)) || findUrl(nip19.noteEncode(ad.event_id || ''))
  }

  return url
}

export async function fetchAppsForEvent(event: NostrEvent): Promise<AppInfos> {
  const addr: EventAddr = { hex: false }

  addr.kind = event.kind
  addr.event_id = event.id
  addr.pubkey = event.pubkey
  if (event.kind >= 30000 && event.kind < 40000) {
    addr.d_tag = getTagValue(event, 'd')
  }
  console.log('resolved addr', addr, event)

  if (addr.kind === undefined) throw new Error('Undefined kind')

  // now fetch the apps for event kind
  let info = kindAppsCache.get(addr.kind)
  if (info) {
    info = { ...info }
    console.log('apps for kind', addr.kind, 'in cache', info)
  }
  if (!info) info = await fetchAppsByKinds(ndk, [addr.kind])

  // put to cache
  if (info.apps.size > 0) {
    kindAppsCache.set(addr.kind, info)
  }

  // init convenient url property for each handler
  // to redirect to this event
  // eslint-disable-next-line
  for (const [_, app] of info.apps) {
    for (const h of app.handlers) {
      // handlers[k] = {
      //   url: url_type[0],
      //   type: url_type[1]
      // }

      h.eventUrl = getHandlerEventUrl(h, addr)
    }
  }

  return info
}

export async function fetchEventByBech32(b32: string): Promise<AugmentedEvent | null> {
  const addr = parseAddr(b32)
  console.log('b32', b32, 'addr', JSON.stringify(addr))
  if (!addr) throw new Error('Bad address')

  return await fetchEventByAddr(ndk, addr)
}

export async function fetchExtendedEventByBech32(b32: string, contactList?: string[]): Promise<AuthoredEvent | null> {
  const addr = parseAddr(b32)
  console.log('b32', b32, 'addr', JSON.stringify(addr))
  if (!addr) throw new Error('Bad address')

  const e = await fetchEventByAddr(ndk, addr)
  if (!e) return null

  // load meta etc using these special augmenters
  let a = null
  switch (e.kind as number) {
    case Kinds.ZAP:
      a = await augmentZaps([e], 0)
      break
    case Kinds.COMMUNITY:
      a = await augmentCommunities([e])
      break
    case Kinds.LIVE_EVENT:
      a = await augmentLiveEvents([e], contactList || [], 1, /*ended*/ true)
      break
    case Kinds.APP:
      a = await augmentApps([e])
      break
    default:
      a = await augmentEventAuthors([e])

      switch (e.kind as number) {
        case Kinds.META:
          a = await augmentMetaEvents(a)
          break
        case Kinds.LONG_NOTE:
          a = await augmentLongNotes(a)
          break
        case Kinds.HIGHLIGHT:
          break
      }
      break
  }

  return a && a.length > 0 ? a[0] : null
}

export function subscribeProfileLists(
  pubkey: string,
  decrypt: (content: string, targetPubkey: string, pubkey?: string) => Promise<string>,
  loadListedEvents: boolean = false
): EventFeed<ProfileListEvent> {
  const feed = subscribePubkeyAuthoredEvents<ProfileListEvent>({
    kind: Kinds.PROFILE_LIST,
    pubkeys: [pubkey],
    limit: 200,
    cacheOnly: true
  })
  feed.onAugments.push(async (authoredLists: AuthoredEvent[]) => {
    const tagsToPubkeys = (tags?: string[][]): string[] => {
      return tags?.map((t) => (t.length >= 2 ? t[1] : '')).filter((p) => !!p) || []
    }

    const events: ProfileListEvent[] = []
    for (const e of authoredLists) {
      const list = createProfileListEvent(e)
      list.name = getTagValue(list, 'name') || getTagValue(list, 'title') || list.identifier
      list.description = getTagValue(list, 'description')

      const ps = getTags(list, 'p')

      list.publicProfilePubkeys = tagsToPubkeys(ps)

      if (list.content) {
        try {
          const content = await decrypt(list.content, list.pubkey)
          const tags = JSON.parse(content) as string[][]
          list.privateProfilePubkeys = tagsToPubkeys(tags.filter((t: string[]) => t.length >= 2 && t[0] === 'p'))
        } catch (e) {
          //        console.log('bad list payload ', list.id, list.content, e)
        }
      }

      // skip irrelevant stuff
      if (list.publicProfilePubkeys.length || list.privateProfilePubkeys.length) events.push(list)
    }

    if (loadListedEvents) {
      const pubkeys = [...new Set(events.map((e) => [...e.publicProfilePubkeys, ...e.privateProfilePubkeys]).flat())]
      const metas = await fetchMetas(pubkeys)
      events.forEach((e) => {
        e.profileEvents = metas.filter(
          (m) => e.publicProfilePubkeys.includes(m.pubkey) || e.privateProfilePubkeys.includes(m.pubkey)
        )
      })
    }

    return events
  })
  return feed
}

// export async function fetchProfileLists(
//   pubkey: string,
//   decrypt: (content: string, targetPubkey: string, pubkey?: string) => Promise<string>,
//   loadListedEvents: boolean = false
// ): Promise<ProfileListEvent[]> {
//   const feed = subscribeProfileLists(pubkey, decrypt, loadListedEvents)
//   return feedToEvents(feed)
// }

export function subscribeBookmarkLists(
  pubkey: string,
  decrypt: (content: string, targetPubkey: string, pubkey?: string) => Promise<string>,
  loadListedEvents: boolean = false
): EventFeed<BookmarkListEvent> {
  const feed = subscribePubkeyAuthoredEvents<BookmarkListEvent>({
    kind: Kinds.BOOKMARKS,
    pubkeys: [pubkey],
    limit: 100,
    cacheOnly: true
  })
  feed.onAugments.push(async (authoredLists: AuthoredEvent[]) => {
    const tagsToBookmarks = (tags?: string[][]): Bookmark[] => {
      return (
        (tags
          ?.map((t) => {
            if (t.length < 2) return null
            const b: Bookmark = {}
            if (t[0] === 'e') b.eventId = t[1]
            else if (t[0] === 'a') b.eventAddr = t[1]
            else if (t[0] === 'r') b.url = t[1]
            else return null

            return b
          })
          .filter((b) => !!b) as Bookmark[]) || []
      )
    }

    const events: BookmarkListEvent[] = []
    for (const e of authoredLists) {
      const list = createBookmarkListEvent(e)
      list.name = getTagValue(list, 'name') || getTagValue(list, 'title') || list.identifier
      list.description = getTagValue(list, 'description')

      list.publicBookmarks = tagsToBookmarks(list.tags)

      if (list.content) {
        try {
          const content = await decrypt(list.content, list.pubkey)
          const tags = JSON.parse(content) as string[][]
          list.privateBookmarks = tagsToBookmarks(tags)
        } catch (e) {
          console.log('bad list payload ', list.id, list.content, e)
        }
      }

      // skip irrelevant stuff
      if (list.publicBookmarks.length || list.privateBookmarks.length) events.push(list)
    }

    if (loadListedEvents) {
      const eventIds = events
        .map((e) => e.publicBookmarks.map((b) => b.eventId).filter((id) => !!id))
        .flat() as string[]
      const eventAddrs = events
        .map((e) => e.publicBookmarks.map((b) => b.eventAddr).filter((id) => !!id))
        .flat() as string[]

      const addrs = [...new Set([...eventIds, eventAddrs].flat())]
        .map((idAddr) => idToAddr(idAddr))
        .filter((addr) => !!addr) as EventAddr[]
      const targetEvents = await fetchEventsByAddrs(ndk, addrs)
      events.forEach((e) => {
        e.events = targetEvents.filter((t) => {
          const id = getEventAddr(t)
          return (
            e.publicBookmarks.find((b) => b.eventId === id || b.eventAddr === id) ||
            e.privateBookmarks.find((b) => b.eventId === id || b.eventAddr === id)
          )
        })
      })
    }

    return events
  })
  return feed
}

// export async function fetchBookmarkLists(
//   pubkey: string,
//   decrypt: (content: string, targetPubkey: string, pubkey?: string) => Promise<string>,
//   loadListedEvents: boolean = false
// ): Promise<BookmarkListEvent[]> {
//   const feed = subscribeBookmarkLists(pubkey, decrypt, loadListedEvents)
//   return feedToEvents(feed)
// }

function idToAddr(id: string, kinds?: number[]): EventAddr | undefined {
  if (id.includes(':')) {
    const v = id.split(':')
    if (v.length === 3) {
      const kind = Number(v[0])
      // pre-filter by target kind
      if (!kinds || kinds.includes(kind))
        return {
          kind,
          pubkey: v[1],
          d_tag: v[2]
        } as EventAddr
    }
  } else if (id) {
    return { event_id: id } as EventAddr
  }
  return undefined
}

async function fetchReactionTargetEventsByKind(pubkey: string, kinds: number[]): Promise<ReactionTargetEvent[]> {
  // FIXME add zap requests from our local db of signed events!
  const ndkEvents = await fetchEventsRead(
    ndk,
    {
      authors: [pubkey],
      kinds: [Kinds.NOTE, Kinds.REACTION, Kinds.REPOST],
      limit: 100
    },
    { cacheOnly: true }
  )

  const events: ReactionTargetEvent[] = [...ndkEvents.values()].map((e) =>
    createReactionTargetEvent(createAuthoredEvent(rawEvent(e)))
  )
  //console.log("reactions", events)

  const getTargetAddr = (e: NostrEvent, tag: string) => {
    let id = ''
    if (e.kind !== Kinds.NOTE) {
      id = getTagValue(e, tag)
    } else {
      const es = getTags(e, tag)
      const root = es.find((t) => t.length >= 3 && t[3] === 'root')?.[1]
      const reply = es.find((t) => t.length >= 3 && t[3] === 'reply')?.[1]
      id = reply || root || getTagValue(e, tag)
    }
    return idToAddr(id, kinds)
  }

  events.forEach((e) => {
    e.targetAddr = getTargetAddr(e, 'a')
    if (!e.targetAddr) e.targetAddr = getTargetAddr(e, 'e')
  })

  const addrs = events.map((e) => e.targetAddr).filter((a) => !!a) as EventAddr[]
  //console.log("reaction target addrs", addrs)

  if (!addrs.length) return []

  const targets = (await fetchEventsByAddrs(ndk, addrs))
    // post-filter by kind
    .filter((t) => kinds.includes(t.kind))
  //console.log("reaction targets", targets)

  if (!targets.length) return []

  const metas = await fetchMetas([...targets.map((e) => e.pubkey), ...events.map((e) => e.pubkey)])
  const authoredTargets = targets.map((t) => {
    const at = createAuthoredEvent(t)
    at.author = metas.find((e) => e.pubkey === t.pubkey)
    return at
  })

  events.forEach((e) => {
    e.author = metas.find((m) => m.pubkey === e.pubkey)
    e.targetEvent = authoredTargets.find((t) => {
      return (
        t.id === e.targetAddr?.event_id ||
        (t.pubkey === e.targetAddr?.pubkey && t.kind === e.targetAddr?.kind && t.identifier === e.targetAddr?.d_tag)
      )
    })
  })
  //console.log("reaction target events", events)

  return events.filter((e) => !!e.targetEvent)
}

export async function fetchReactionTargetNotes(pubkey: string): Promise<ReactionTargetEvent[]> {
  return await fetchReactionTargetEventsByKind(pubkey, [Kinds.NOTE])
}

export async function fetchReactionTargetLongNotes(pubkey: string): Promise<ReactionTargetEvent[]> {
  const authoredEvents = await fetchReactionTargetEventsByKind(pubkey, [Kinds.LONG_NOTE])
  return await augmentLongNotes(authoredEvents)
}

export async function searchProfiles(q: string): Promise<MetaEvent[]> {
  // try to fetch best profiles from our relay
  const top: NostrTop | null = await ndk.fetchTop(
    {
      kinds: [Kinds.META],
      search: q,
      limit: 30
    },
    NDKRelaySet.fromRelayUrls([nostrbandRelay], ndk)
  )
  console.log('top profiles', top?.ids.length)

  const events: MetaEvent[] = []
  if (!top) return events

  if (top.ids.length) {
    const augmentedEvents = await fetchEventsByIds({
      ids: top.ids,
      kinds: [Kinds.META],
      remote: true
    })

    // convert to meta events
    const metaEvents = augmentMetaEvents(augmentedEvents)

    // put to cache
    putEventsToCache(metaEvents)

    events.push(...metaEvents)
  }

  // order by top.ids
  events.forEach((e) => {
    e.order = top.ids.findIndex((i: string) => e.id === i)
  })

  sortAsc(events)

  return events
}

export async function fetchMetas(pubkeys: string[], remote?: boolean): Promise<MetaEvent[]> {
  // dedup
  pubkeys = [...new Set(pubkeys)]

  const metas: MetaEvent[] = []
  const reqPubkeys = new Set<string>()
  pubkeys.forEach((p) => {
    const meta = metaCache.get(p)
    if (meta) metas.push({ ...meta })
    else reqPubkeys.add(p)
  })

  const fetch = async (cacheOnly: boolean) => {
    const ndkEvents = await fetchEventsRead(
      ndk,
      {
        kinds: [Kinds.META],
        authors: [...reqPubkeys]
      },
      { cacheOnly }
    )

    const augmentedEvents = [...ndkEvents.values()].map((e) => rawEvent(e))
    const metaEvents = augmentMetaEvents(augmentedEvents)

    const wasSize = reqPubkeys.size
    metaEvents.forEach((e) => reqPubkeys.delete(e.pubkey))
    putEventsToCache(metaEvents)
    metas.push(...metaEvents)

    return [wasSize, metaEvents.length]
  }

  if (reqPubkeys.size > 0) {
    const [reqs, fetched] = await fetch(true)
    console.log('fetchMetas cached', reqs, fetched)
  }

  if (remote && reqPubkeys.size > 0) {
    const [reqs, fetched] = await fetch(false)
    console.log('fetchMetas remote', reqs, fetched)
  }

  return metas
}

async function augmentEventAuthors(events: AugmentedEvent[], remote?: boolean): Promise<AuthoredEvent[]> {
  const authoredEvents = events.map((e) => createAuthoredEvent(e))
  if (authoredEvents.length > 0) {
    // profile infos
    const metas = await fetchMetas(
      events.map((e) => e.pubkey),
      remote
    )

    // assign to notes
    authoredEvents.forEach((e) => (e.author = metas.find((m) => m.pubkey === e.pubkey)))
  }

  return authoredEvents
}

function augmentMetaEvents(events: AugmentedEvent[]): MetaEvent[] {
  const metaEvents = events.map((e) => {
    const m = createMetaEvent(e)
    m.profile = parseProfileJson(m)
    return m
  })
  return metaEvents
}

interface IFetchEventByIdsParams {
  ids: string[]
  kinds: number[]
  remote?: boolean
}

async function fetchEventsByIds({ ids, kinds, remote = false }: IFetchEventByIdsParams): Promise<AugmentedEvent[]> {
  const results: AugmentedEvent[] = []
  const reqIds = new Set<string>()
  ids.forEach((id) => {
    const ne = eventCache.get(id)
    if (ne) {
      // make sure kinds match
      if (kinds.includes(ne.kind)) results.push({ ...ne })
    } else {
      reqIds.add(id)
    }
  })

  const fetch = async (cacheOnly: boolean) => {
    const ndkEvents = await fetchEventsRead(
      ndk,
      {
        ids: [...reqIds],
        kinds
      },
      { cacheOnly }
    )
    //    console.log('ids', ids, 'reqIds', reqIds, 'kinds', kinds, 'events', ndkEvents)

    const wasSize = reqIds.size
    const events = [...ndkEvents.values()].filter((e) => ids.includes(e.id)).map((e) => rawEvent(e))
    events.forEach((e) => reqIds.delete(e.id))
    putEventsToCache(events)
    results.push(...events)
    return [wasSize, events.length]
  }

  if (reqIds.size > 0) {
    const [reqs, fetched] = await fetch(true)
    console.log('fetchEventsByIds cached', reqs, fetched)
  }

  if (remote && reqIds.size > 0) {
    const [reqs, fetched] = await fetch(false)
    console.log('fetchEventsByIds remote', reqs, fetched)
  }

  // desc by tm
  sortDesc(results)

  console.log('events by ids prepared', results)
  return results
}

function augmentLongNotes(events: AuthoredEvent[]): LongNoteEvent[] {
  const longNotes = events.map((e) => createLongNoteEvent(e))
  longNotes.forEach((e) => {
    e.title = getTagValue(e, 'title')
    e.summary = getTagValue(e, 'summary')
    e.published_at = Number(getTagValue(e, 'published_at'))
  })
  return longNotes
}

async function augmentZaps(augmentedEvents: AugmentedEvent[], minZap: number): Promise<ZapEvent[]> {
  let zapEvents = augmentedEvents.map((e) => createZapEvent(e))

  zapEvents.forEach((e) => {
    e.description = createEvent(parseContentJson(getTagValue(e, 'description')))
    try {
      e.bolt11 = bolt11Decode(getTagValue(e, 'bolt11'))
    } catch {
      e.bolt11 = undefined
    }
    e.amountMsat = Number(e.bolt11?.sections?.find((s) => s.name === 'amount')?.value || '')
    e.targetEventId = getTagValue(e, 'e')
    e.targetAddr = getTagValue(e, 'a')
    e.targetPubkey = getTagValue(e, 'p')
    e.providerPubkey = e.pubkey
    e.senderPubkey = e.description?.pubkey
  })

  // drop zaps w/o a target event
  zapEvents = zapEvents.filter((e) => !!e.targetEventId)

  if (minZap) {
    zapEvents = zapEvents.filter((e) => e.amountMsat / 1000 >= minZap)
  }

  if (zapEvents.length > 0) {
    // target event infos
    const ids = zapEvents.map((e) => e.targetEventId).filter((id) => !!id)
    const augmentedTargetsEvents = await fetchEventsByIds({
      ids,
      kinds: [Kinds.NOTE, Kinds.LONG_NOTE, Kinds.COMMUNITY, Kinds.LIVE_EVENT, Kinds.APP]
    })

    // profile infos
    const pubkeys = new Set<string>()
    zapEvents.forEach((e) => {
      pubkeys.add(e.providerPubkey)
      if (e.targetPubkey) pubkeys.add(e.targetPubkey)
      if (e.senderPubkey) pubkeys.add(e.senderPubkey)
    })
    augmentedTargetsEvents.forEach((e) => pubkeys.add(e.pubkey))

    console.log('zap meta pubkeys', pubkeys)
    const metas = await fetchMetas([...pubkeys.values()])

    // assign to zaps
    zapEvents.forEach((e) => {
      const target = augmentedTargetsEvents.find((t) => t.id === e.targetEventId)
      if (target) {
        e.targetEvent = createAuthoredEvent(target)
        // FIXME receive frozen object property error when change profile!
        e.targetEvent.author = metas.find((m) => m.pubkey === e.targetEvent?.pubkey)
      }

      e.targetMeta = metas.find((m) => m.pubkey === e.targetPubkey)
      e.providerMeta = metas.find((m) => m.pubkey === e.providerPubkey)
      e.senderMeta = metas.find((m) => m.pubkey === e.senderPubkey)
      e.author = e.providerMeta
    })
  }

  // desc
  sortDesc(zapEvents)

  return zapEvents
}

async function augmentCommunities(events: AugmentedEvent[]): Promise<CommunityEvent[]> {
  const pubkeys = new Set<string>()
  const communities = events.map((e) => createCommunityEvent(e))
  communities.forEach((e) => {
    e.name = e.identifier
    e.description = getTagValue(e, 'description')
    e.image = getTagValue(e, 'image')
    e.moderators = getTags(e, 'p')
      .filter((p) => p.length >= 4 && p[3] === 'moderator')
      .map((p) => p[1])

    pubkeys.add(e.pubkey)
    e.moderators.forEach((m) => pubkeys.add(m))
  })

  console.log('communities meta pubkeys', pubkeys)
  const metas = await fetchMetas([...pubkeys.values()], true)

  // assign to events
  communities.forEach((e) => {
    e.author = metas.find((m) => m.pubkey === e.pubkey)
    e.moderatorsMetas = metas.filter((m) => e.moderators.includes(m.pubkey))
  })

  return communities
}

function augmentCommunitiesApprovals(
  communities: CommunityEvent[],
  approvals: CommunityApprovalInfo[]
): ExtendedCommunityEvent[] {
  // extend
  const ecs = communities.map((e) => {
    const c = createExtendedCommunityEvent(e)
    const apprs = approvals.filter((a) => a.communityPubkey === e.pubkey && a.communityIdentifier === e.identifier)
    c.last_post_tm = apprs[0].created_at
    c.order = c.last_post_tm
    c.posts = apprs.length
    return c
  })

  // desc
  sortDesc(ecs)

  return ecs
}

interface SearchEventsParams {
  q: string
  kind: number
  limit?: number
}

async function searchEvents({ q, kind, limit = 30 }: SearchEventsParams): Promise<AugmentedEvent[]> {
  const ndkEvents = await ndk.fetchEvents(
    {
      kinds: [kind],
      search: q,
      limit
    },
    {}, // opts
    NDKRelaySet.fromRelayUrls([nostrbandRelay], ndk)
  )
  const augmentedEvents = [...ndkEvents.values()].map((e) => rawEvent(e))

  // desc by tm
  sortDesc(augmentedEvents)

  if (augmentedEvents.length > limit) augmentedEvents.length = limit

  console.log('search events prepared', augmentedEvents)

  return augmentedEvents
}

async function searchAuthoredEvents(params: SearchEventsParams): Promise<AuthoredEvent[]> {
  const augmentedEvents = await searchEvents(params)
  return await augmentEventAuthors(augmentedEvents, true)
}

export async function searchNotes(q: string, limit: number = 30): Promise<AuthoredEvent[]> {
  return searchAuthoredEvents({
    q,
    kind: Kinds.NOTE,
    limit
  })
}

export async function searchLongNotes(q: string, limit: number = 30): Promise<LongNoteEvent[]> {
  const events = await searchAuthoredEvents({
    q,
    kind: Kinds.LONG_NOTE,
    limit
  })
  return await augmentLongNotes(events)
}

export async function searchLiveEvents(q: string, limit: number = 30): Promise<LiveEvent[]> {
  const events = await searchEvents({
    q,
    kind: Kinds.LIVE_EVENT,
    limit
  })
  return await augmentLiveEvents(events, [], limit, /*ended*/ true)
}

export async function searchCommunities(q: string, limit: number = 30): Promise<CommunityEvent[]> {
  const augmentedEvents = await searchEvents({
    q,
    kind: Kinds.COMMUNITY,
    limit
  })
  const communities = await augmentCommunities(augmentedEvents)
  console.log('search communities', communities)
  return communities
}

interface PromiseQueueCb {
  // eslint-disable-next-line
  cb: (...args: any[]) => void
  // eslint-disable-next-line
  args: any[]
}

// used for handling a sequence of events and an eose after them,
// since each event-handling callback might be async we have to execute
// them one by one through a queue to ensure eose marker comes last
class PromiseQueue {
  queue: PromiseQueueCb[] = []

  constructor() {}
  // eslint-disable-next-line
  appender(cb: (...cbArgs: any[]) => void): (...apArgs: any[]) => void {
    return (...args) => {
      this.queue.push({ cb, args })
      if (this.queue.length === 1) this.execute()
    }
  }

  async execute() {
    // the next cb in the queue
    const { cb, args } = this.queue[0]

    // execute the next cb
    await cb(...args)

    // mark the last cb as done
    this.queue.shift()

    // have the next one? proceed
    if (this.queue.length > 0) this.execute()
  }
}

interface IFetchPubkeyEventsParams {
  kind?: number
  pubkeys: string[]
  tagged?: boolean
  limit?: number
  identifiers?: string[]
  cacheOnly?: boolean
}

export async function fetchPubkeyEvents({
  kind,
  pubkeys,
  tagged = false,
  limit = 30,
  identifiers = undefined,
  cacheOnly = false
}: IFetchPubkeyEventsParams): Promise<AugmentedEvent[]> {
  const pks = [...pubkeys]
  if (pks.length > 200) pks.length = 200

  const filter: NDKFilter = {
    limit
  }

  if (kind !== undefined) filter.kinds = [kind]

  if (tagged) filter['#p'] = pks
  else filter.authors = pks

  if (identifiers && identifiers.length > 0) filter['#d'] = identifiers

  const ndkEvents = await fetchEventsRead(ndk, filter, { cacheOnly })
  //  console.log("fetchEventsRead ndkEvents", ndkEvents)
  const augmentedEvents = [...ndkEvents.values()].map((e) => rawEvent(e))

  // desc by tm
  sortDesc(augmentedEvents)

  if (augmentedEvents.length > limit) augmentedEvents.length = limit

  return augmentedEvents
}

export class EventFeed<T extends AugmentedEvent | AppNostr> {
  private sub: NDKSubscription
  private events: T[] = []
  private buffer: AugmentedEvent[] = []
  private eose: boolean = false
  private wasEose: boolean = false
  private augmenting: boolean = false
  // eslint-disable-next-line
  private augmentTimer: any = undefined

  onUpdate?: (events: T[]) => void
  onAugments: ((events: AugmentedEvent[]) => Promise<AugmentedEvent[]>)[] = []
  sortAsc?: boolean
  onEOSE?: (events: T[]) => void
  limit?: number
  stream?: boolean

  constructor(sub: NDKSubscription) {
    this.sub = sub

    this.initSub()
  }

  start() {
    this.sub.start()
  }

  reload() {
    this.sub.stop()

    this.sub = new NDKSubscription(this.sub.ndk, this.sub.filters, this.sub.opts, this.sub.relaySet)

    this.initSub()

    this.wasEose = false
    this.eose = false
    this.sub.start()
  }

  stop() {
    this.sub.stop()
    this.onUpdate = undefined
    this.onAugments.length = 0
    this.onEOSE = undefined
  }

  private initSub() {
    this.sub.on('event', this.onEvent.bind(this))
    this.sub.on(
      'eose',
      (() => {
        this.onEvent(undefined)
      }).bind(this)
    )
  }

  private onEvent(e?: NDKEvent) {
    // put to buffer
    if (e) this.buffer.push(rawEvent(e))
    else this.eose = true

    if (this.augmentTimer || this.augmenting) return
    if (!this.augmenting) this.augmentTimer = setTimeout(this.augment.bind(this), 10)
  }

  private merge(batch: AugmentedEvent[] | AppNostr[]) {
    const events = [...this.events]
    for (const e of batch) {
      // @ts-ignore
      const a = e.id ? getEventAddr(e) : e.naddr
      const i = events.findIndex((o) => getEventAddr(o) === a)
      const t = e as T
      if (i >= 0) {
        events[i] = t
      } else {
        events.push(t)
      }
    }

    if (this.sortAsc) sortAsc(events as AugmentedEvent[])
    else sortDesc(events as AugmentedEvent[])

    if (this.limit && events.length > this.limit) events.length = this.limit

    this.events = events
  }

  private async augmentBuffer(buffer: AugmentedEvent[]): Promise<AugmentedEvent[] | AppNostr[]> {
    for (const a of this.onAugments) buffer = await a(buffer)
    return buffer
  }

  private async augment() {
    if (this.augmentTimer) clearTimeout(this.augmentTimer)
    this.augmentTimer = undefined
    this.augmenting = true

    // take the buffer
    const buffer = [...this.buffer]
    this.buffer.length = 0

    // process
    if (this.onAugments.length) this.merge(await this.augmentBuffer(buffer))
    else this.merge(buffer)

    // notify client
    if (this.stream || this.wasEose) this.onUpdate?.(this.events)

    // if eose arrived and there's nothing else buffered
    if (!this.wasEose && this.eose && !this.buffer.length) {
      this.eose = false
      this.wasEose = true
      this.onEOSE?.(this.events)
    }

    // done
    this.augmenting = false

    // next batch? arm the timer
    if (this.buffer.length) this.augmentTimer = setTimeout(this.augment.bind(this), 10)
  }
}

function subscribePubkeyEvents({
  kind,
  pubkeys,
  tagged = false,
  limit = 30,
  identifiers = undefined,
  cacheOnly = false
}: IFetchPubkeyEventsParams): NDKSubscription {
  const pks = [...pubkeys]
  if (pks.length > 200) pks.length = 200

  const filter: NDKFilter = {
    limit
  }

  if (kind !== undefined) filter.kinds = [kind]

  if (tagged) filter['#p'] = pks
  else filter.authors = pks

  if (identifiers && identifiers.length > 0) filter['#d'] = identifiers

  return subscribe(ndk, filter, { cacheOnly })
}

function subscribePubkeyAuthoredEvents<T extends AuthoredEvent>(params: IFetchPubkeyEventsParams): EventFeed<T> {
  const sub = subscribePubkeyEvents(params)
  const feed = new EventFeed<T>(sub)
  feed.onAugments.push(async (events: AugmentedEvent[]) => {
    return await augmentEventAuthors(events, !params.cacheOnly)
  })
  feed.limit = params.limit || 30
  return feed
}

export function subscribeFollowedLongNotes(contactPubkeys: string[]): EventFeed<LongNoteEvent> {
  const feed = subscribePubkeyAuthoredEvents<LongNoteEvent>({
    kind: Kinds.LONG_NOTE,
    pubkeys: contactPubkeys,
    cacheOnly: true
  })
  feed.onAugments.push(async (events: AuthoredEvent[]) => {
    return await augmentLongNotes(events)
  })
  return feed
}

async function fetchPubkeyAuthoredEvents(params: IFetchPubkeyEventsParams): Promise<AuthoredEvent[]> {
  const augmentedEvents = await fetchPubkeyEvents(params)
  return await augmentEventAuthors(augmentedEvents, !params.cacheOnly)
}

// async function feedToEvents<T extends AugmentedEvent | AppNostr>(feed: EventFeed<T>): Promise<T[]> {
//   return new Promise(ok => {
//     feed.onEOSE = (events: T[]) => {
//       feed.stop()
//       ok(events)
//     }
//     feed.start()
//   })
// }

// export async function fetchFollowedLongNotes(contactPubkeys: string[]): Promise<LongNoteEvent[]> {
//   const feed = subscribeFollowedLongNotes(contactPubkeys)
//   return feedToEvents(feed)
// }

export function subscribeFollowedHighlights(contactPubkeys: string[]): EventFeed<HighlightEvent> {
  const feed = subscribePubkeyAuthoredEvents<HighlightEvent>({
    kind: Kinds.HIGHLIGHT,
    pubkeys: contactPubkeys,
    cacheOnly: true
  })
  feed.onAugments.push(async (events: AuthoredEvent[]) => {
    return events.map((e) => createHighlightEvent(e))
  })
  return feed
}

// export async function fetchFollowedHighlights(contactPubkeys: string[]): Promise<HighlightEvent[]> {
//   const feed = subscribeFollowedHighlights(contactPubkeys)
//   return feedToEvents(feed)
// }

export function subscribeFollowedZaps(contactPubkeys: string[], minZap: number): EventFeed<ZapEvent> {
  const feed = subscribePubkeyAuthoredEvents<ZapEvent>({
    kind: Kinds.ZAP,
    pubkeys: contactPubkeys,
    tagged: true,
    limit: 200,
    cacheOnly: true
  })
  feed.onAugments.push(async (events: AuthoredEvent[]) => {
    return await augmentZaps(events, minZap)
  })
  return feed
}

// export async function fetchFollowedZaps(contactPubkeys: string[], minZap: number): Promise<ZapEvent[]> {
//   const feed = subscribeFollowedZaps(contactPubkeys, minZap)
//   return feedToEvents(feed)
// }

export async function fetchFollowedCommunities(contactPubkeys: string[]): Promise<ExtendedCommunityEvent[]> {
  const approvalEvents = await fetchPubkeyEvents({
    kind: Kinds.COMMUNITY_APPROVAL,
    pubkeys: contactPubkeys,
    limit: 100,
    cacheOnly: true
  })

  // desc
  sortDesc(approvalEvents)
  console.log('approvals', approvalEvents)

  const approvals: CommunityApprovalInfo[] = approvalEvents
    .map((e) => {
      return { tm: e.created_at, p: getTagValue(e, 'a').split(':') }
    })
    .filter((a) => a.p.length == 3 && Number(a.p[0]) === Kinds.COMMUNITY)
    .map((a) => {
      const i = createCommunityApprovalInfo()
      i.created_at = a.tm
      i.communityPubkey = a.p[1]
      i.communityIdentifier = a.p[2]
      return i
    })
  //  console.log("addrs", addrs);

  if (approvals.length === 0) return []

  // FIXME switch to fetchEventsByAddrs
  const authoredEvents = await fetchPubkeyAuthoredEvents({
    kind: Kinds.COMMUNITY,
    pubkeys: [...new Set(approvals.map((a) => a.communityPubkey))],
    identifiers: [...new Set(approvals.map((a) => a.communityIdentifier))],
    limit: 100
  })

  const communities = await augmentCommunities(authoredEvents)
  const extendedCommunities = await augmentCommunitiesApprovals(communities, approvals)
  console.log('communities extended', extendedCommunities)
  return extendedCommunities
}

async function augmentLiveEvents(
  augmentedEvent: AugmentedEvent[],
  contactPubkeys: string[],
  limit: number,
  ended = false
): Promise<LiveEvent[]> {
  // convert to an array of raw events

  let liveEvents = augmentedEvent.map((e) => createLiveEvent(createAuthoredEvent(e)))

  const MAX_LIVE_TTL = 3600
  liveEvents.forEach((e) => {
    e.title = getTagValue(e, 'title')
    e.summary = getTagValue(e, 'summary')
    e.starts = Number(getTagValue(e, 'starts'))
    e.current_participants = Number(getTagValue(e, 'current_participants'))
    e.status = getTagValue(e, 'status')

    // NIP-53: Clients MAY choose to consider status=live events
    // after 1hr without any update as ended.
    if (Date.now() / 1000 - e.created_at > MAX_LIVE_TTL) e.status = 'ended'

    const ps = getTags(e, 'p')
    e.host = ps.find((p) => p.length >= 4 && (p[3] === 'host' || p[3] === 'Host'))?.[1] || ''
    e.members = ps.filter((p) => p.length >= 4 && (!contactPubkeys || contactPubkeys.includes(p[1]))).map((p) => p[1])

    // newest-first
    e.order = e.starts

    // reverse order of all non-live events and make
    // them go after live ones
    if (e.status !== 'live') e.order = -e.order
  })

  // drop ended ones
  liveEvents = liveEvents.filter((e) => {
    return (
      !!e.host &&
      // For now let's show live events where some of our following are participating
      //	&& contactPubkeys.includes(e.host)
      (ended || e.status !== 'ended')
    )
  })

  // desc
  sortDesc(liveEvents)

  // crop
  if (liveEvents.length > limit) liveEvents.length = limit

  // fetch metas
  if (liveEvents.length > 0) {
    // profile infos
    const metas = await fetchMetas(liveEvents.map((e) => [e.pubkey, ...e.members]).flat())

    // assign to live events
    liveEvents.forEach((e) => {
      e.author = metas.find((m) => m.pubkey === e.pubkey) // provider
      e.hostMeta = metas.find((m) => m.pubkey === e.host) // host
      e.membersMeta = metas.filter((m) => e.members.includes(m.pubkey)) // all members: host, speakers, participants
    })
  }

  return liveEvents
}

async function augmentApps(augmentedEvent: AugmentedEvent[]): Promise<AppEvent[]> {
  const appEvents = augmentedEvent.map((e) => createAppEvent(createAuthoredEvent(e)))

  appEvents.forEach((e) => {
    e.naddr = nip19.naddrEncode({
      pubkey: e.pubkey,
      kind: e.kind,
      identifier: e.identifier
    })

    const kinds = new Set<number>()
    for (const t of getTags(e, 'k')) {
      if (t.length < 2) continue
      const k = Number(t[1])
      if (k < 0 || k > 10000000 || isNaN(k)) continue
      kinds.add(k)
    }
    e.kinds = [...kinds]

    const ps = new Set<string>()
    e.urls = []
    for (const p of PLATFORMS) {
      // urls for platform p
      const urls = getTags(e, p)
      for (const url of urls) {
        if (url.length < 2) continue

        const type = url.length > 2 ? url[2] : ''

        // default or one of known types?
        if (type != '' && !ADDR_TYPES.find((t) => t === type)) continue

        ps.add(p)
        e.urls.push({
          url: url[1],
          type
        } as AppUrl)
      }
    }
    e.platforms = [...ps.values()]

    e.appAuthorPubkey = getTagValue(e, 'author')

    if (e.content) e.meta = parseContentJson(e.content)

    e.appId = e.identifier
    if (e.meta) e.appId = e.meta?.name || e.meta?.display_name || ''
  })

  // fetch metas
  if (appEvents.length > 0) {
    // profile infos
    const pubkeys = new Set<string>()
    appEvents.forEach((e) => {
      pubkeys.add(e.pubkey)
      if (e.appAuthorPubkey) pubkeys.add(e.appAuthorPubkey)
    })
    const metas = await fetchMetas([...pubkeys])

    // assign to live events
    appEvents.forEach((e) => {
      e.appAuthorMeta = metas.find((m) => m.pubkey === e.appAuthorPubkey)
      e.author = metas.find((m) => m.pubkey === e.pubkey)
      if (!e.meta) {
        e.meta = e.author?.profile
      }
    })
  }

  return appEvents
}

export function subscribeFollowedLiveEvents(contactPubkeys: string[], limit: number = 30): EventFeed<LiveEvent> {
  const feed = subscribePubkeyAuthoredEvents<LiveEvent>({
    kind: Kinds.LIVE_EVENT,
    pubkeys: contactPubkeys,
    tagged: true,
    cacheOnly: true,
    limit
  })
  feed.onAugments.push(async (events: AuthoredEvent[]) => {
    return await augmentLiveEvents(events, contactPubkeys, limit)
  })
  return feed
}

// export async function fetchFollowedLiveEvents(contactPubkeys: string[], limit: number = 30): Promise<LiveEvent[]> {
//   const feed = subscribeFollowedLiveEvents(contactPubkeys, limit)
//   return feedToEvents(feed)
// }

class Subscription<OutputEventType> {
  lastSub: NDKSubscription | null = null
  label: string = ''
  onEvent: (e: AugmentedEvent) => Promise<OutputEventType>
  filter: NDKFilter

  constructor(label: string, onEvent: (e: AugmentedEvent) => Promise<OutputEventType>) {
    this.label = label
    this.onEvent = onEvent
  }

  async onReconnect(): Promise<void> {
    if (!this.lastSub) return
    this.lastSub.stop()

    // let the unsubs happen
    setTimeout(async () => {
      await this.lastSub.start()
    }, 300)
  }

  async restart(filter: NDKFilter, cb: (e: OutputEventType) => Promise<void>) {
    // gc
    if (this.lastSub) {
      this.lastSub.stop()
      this.lastSub = null
    }

    this.filter = filter

    const events = new Map<string, NDKEvent>()
    let eose = false

    const sub: NDKSubscription = await ndk.subscribe(
      filter,
      { closeOnEose: false, skipVerification: true },
      NDKRelaySet.fromRelayUrls([cacheRelay], ndk),
      /* autoStart */ false
    )
    console.log('sub start', filter)

    // ensure async callbacks are executed one by one
    const pq = new PromiseQueue()

    // helper to transform and return the event
    const returnEvent = async (event: NDKEvent) => {
      const ae = rawEvent(event)
      putEventsToCache([ae])
      const e = await this.onEvent(ae)
      console.log('returning', this.label, e)
      await cb(e)
    }

    sub.on('event:dup', (event: NDKEvent, relay: NDKRelay) => {
      console.log('sub event dup', event.id, 'kind', event.kind, 'from relay', relay.url)
    })

    // call cb on each event
    sub.on('event', (event: NDKEvent, relay: NDKRelay) => {
      console.log('sub event', event.id, 'at', Date.now(), 'kind', event.kind, 'from relay', relay.url)
      // dedup
      const dedupKey = event.deduplicationKey()
      const existingEvent = events.get(dedupKey)
      // console.log("dedupKey", dedupKey, "existingEvent", existingEvent?.created_at, "event", event.created_at);
      if (existingEvent?.created_at > event.created_at) {
        // ignore old event
        return
      }
      events.set(dedupKey, event)

      // add to promise queue
      pq.appender(async (event: NDKEvent) => {
        console.log('got new', this.label, 'event', event, 'from', event.relay.url)

        // we've reached the end and this is still the newest event?
        if (eose && events.get(dedupKey) == event) await returnEvent(event)
      })(event)
    })

    // notify that initial fetch is over
    sub.on(
      'eose',
      pq.appender(async (_, reason) => {
        console.log('eose was', eose, this.label, 'events', events.size, 'reason', reason, 'at', Date.now())
        if (eose) return // WTF second one?

        eose = true
        for (const e of [...events.values()]) await returnEvent(e)
      })
    )

    // start
    console.log('sub start', this.label, 'at', Date.now())
    sub.start()

    // store
    this.lastSub = sub
  }
}

const profileSub = new Subscription<MetaEvent>('profile', (p: AugmentedEvent) => {
  const [m] = augmentMetaEvents([p])
  return Promise.resolve(m)
})

export async function subscribeProfiles(pubkeys: string[], cb: (m: MetaEvent) => Promise<void>) {
  profileSub.restart(
    {
      authors: [...pubkeys],
      kinds: [Kinds.META]
    },
    cb
  )
}

const contactListSub = new Subscription<ContactListEvent>('contact list', async (e: AugmentedEvent) => {
  const contactList = createContactListEvent(e)

  contactList.contactPubkeys = [
    ...new Set(contactList.tags.filter((t) => t.length >= 2 && t[0] === 'p').map((t) => t[1]))
  ]
  contactList.contactEvents = []

  if (contactList.contactPubkeys.length) {
    // profiles
    const contactEvents = await fetchMetas(contactList.contactPubkeys)

    // assign order
    contactEvents.forEach((p) => {
      p.order = contactList.contactPubkeys.findIndex((pk) => pk == p.pubkey)
    })

    sortDesc(contactEvents)

    contactList.contactEvents = contactEvents
  }

  return contactList
})

export async function subscribeContactList(pubkey: string, cb: (e: ContactListEvent) => Promise<void>) {
  contactListSub.restart(
    {
      authors: [pubkey],
      kinds: [Kinds.CONTACT_LIST]
    },
    cb
  )
}

export function stringToBech32(s: string, hex: boolean = false): string {
  if (!s) return ''
  const BECH32_REGEX = /[a-z]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/g

  const array = [...s.matchAll(BECH32_REGEX)].map((a) => a[0])

  let bech32 = ''
  for (const b32 of array) {
    try {
      const { type } = nip19.decode(b32)
      //      console.log("b32", b32, "type", type, "data", data);
      switch (type) {
        case 'npub':
        case 'nprofile':
        case 'note':
        case 'nevent':
        case 'naddr':
          bech32 = b32
          break
      }
    } catch (e) {
      console.log('bad b32', b32, 'e', e)
    }

    if (bech32) return bech32
  }

  if (hex) {
    if (s.length == 64 && s.match(/0-9A-Fa-f]{64}/g)) return s
  }

  return ''
}

// eslint-disable-next-line
export function stringToBolt11(s: string): [string, any] {
  if (!s) return ['', null]

  const INVOICE_REGEX = /^(lnbcrt|lntb|lnbc|LNBCRT|LNTB|LNBC)([0-9]{1,}[a-zA-Z0-9]+){1}$/g

  const array = [...s.matchAll(INVOICE_REGEX)].map((a) => a[0])

  for (const b32 of array) {
    console.log('maybe invoice', b32, s)
    if (!b32.toLowerCase().startsWith('lnbc')) continue
    try {
      return [b32, bolt11Decode(b32)]
    } catch (e) {
      console.log('bad invoice', b32, 'e', e)
    }
  }

  return ['', null]
}

export function createAddrOpener(cb: (addr: string) => void): (event: NostrEvent) => void {
  return (event: NostrEvent) => {
    let addr = event.id

    if (event.kind === Kinds.META) {
      // npub
      addr = nip19.npubEncode(event.pubkey)
    } else if ((event.kind >= 10000 && event.kind < 20000) || (event.kind >= 30000 && event.kind < 40000)) {
      // naddr
      addr = nip19.naddrEncode({
        pubkey: event.pubkey,
        kind: event.kind,
        identifier: getTagValue(event, 'd'),
        relays: [nostrbandRelay]
      })
    } else {
      // nevent
      addr = nip19.neventEncode({
        id: event.id,
        relays: [nostrbandRelay]
      })
    }

    console.log('addr', addr)
    cb(addr)
  }
}

export function connect(): Promise<void> {
  // main instance
  ndk = new NDK({ explicitRelayUrls: [cacheRelay, ...allRelays] })

  const scheduleStats = () => {
    setTimeout(() => {
      console.log('ndk stats', JSON.stringify(ndk.pool.stats()))
      scheduleStats()
    }, 5000)
  }
  scheduleStats()

  return ndk.pool.connect(/* timeoutMs */ 1000, /* minConns */ 3)
}

function addRelay(r: string): NDKRelay {
  if (!ndk.pool.relays.get(r)) ndk.pool.addRelay(new NDKRelay(r))
  return ndk.pool.relays.get(r)
}

export async function addWalletInfo(info: WalletInfo): Promise<void> {
  const relay = await addRelay(info.relay)
  relay.on('notice', (msg: string) => console.log('notice from', info.relay, msg))
  relay.on('publish:failed', (event: NDKEvent, err: string) => console.log('publish failed to', info.relay, event, err))
}

export async function sendPayment(info: WalletInfo, payreq: string): Promise<{ preimage: string }> {
  const relay = await addRelay(info.relay)
  console.log('relay', relay.url, 'status', relay.status)

  const req = {
    method: 'pay_invoice',
    params: {
      invoice: payreq
    }
  }

  const encReq = await walletstore.encrypt(info.publicKey, JSON.stringify(req))
  console.log('encReq', encReq)

  const event = {
    pubkey: info.publicKey,
    kind: Kinds.NWC_PAYMENT_REQUEST,
    tags: [['p', info.publicKey]],
    content: encReq,
    created_at: Math.floor(Date.now() / 1000)
  }

  const signed = await walletstore.signEvent(event)
  console.log('signed', JSON.stringify(signed))
  console.log('signed id', signed.id)

  const relaySet = NDKRelaySet.fromRelayUrls([info.relay], ndk)

  const sub = await ndk.subscribe(
    {
      kinds: [Kinds.NWC_PAYMENT_REPLY],
      '#e': [signed.id],
      authors: [info.publicKey]
    },
    { closeOnEose: false },
    relaySet,
    /* autoStart */ false
  )

  return new Promise((ok, err) => {
    // make sure we don't wait forever
    const TIMEOUT_MS = 30000 // 30 sec
    const to = setTimeout(() => {
      sub.stop()
      err('Timeout error, payment might have failed')
    }, TIMEOUT_MS)

    sub.on('event', async (e: NDKEvent) => {
      e = rawEvent(e)
      if (
        e.pubkey === info.publicKey &&
        e.tags.find((t: string[]) => t.length >= 2 && t[0] === 'e' && t[1] === signed.id)
      ) {
        clearTimeout(to)
        console.log('payment reply event', JSON.stringify(e))

        const rep = JSON.parse(await walletstore.decrypt(e.pubkey, e.content))
        console.log('payment reply', JSON.stringify(rep))

        if (rep.result_type === 'pay_invoice') {
          if (rep.error) err(rep.error.message || 'Error from the wallet')
          else ok({ preimage: rep.result.preimage })
        } else {
          err('Invalid payment reply')
        }
      } else {
        console.log('irrelevant event received', JSON.stringify(e))
      }
    })

    // publish when we're 100% sure we've subscribed to replies
    sub.on('eose', async () => {
      // publish
      try {
        const r = await ndk.publish(new NDKEvent(ndk, signed), relaySet, TIMEOUT_MS / 2)
        console.log('published', r)
      } catch (e) {
        err('Failed to send payment request: ' + e)
      }
    })

    // subscribe before publishing
    sub.start()
  })
}

export function setOnAddLocalRelayEvents(cb: (e: NostrEvent[]) => Promise<boolean[]>) {
  onAddLocalRelayEvents = cb
}

export function putEventsToCache(events: AugmentedEvent[] | MetaEvent[]) {
  const nes = events.map((e) => {
    if (e.kind === (Kinds.META as number)) metaCache.set(e.pubkey, e)
    eventCache.set(e.id, e)
    addrCache.set(getEventAddr(e), e)
    return nostrEvent(e)
  })
  onAddLocalRelayEvents?.(nes).then((oks) => {
    dbi.putLocalRelayEvents(nes.filter((_, i) => oks[i]))
  })
}

export function setNsbSigner(token: string) {
  nsbSigner = new NDKNip46Signer(nsbNDK, token, new NDKNip07Signer())
}

export async function checkNsbSigner() {
  if (!nsbSigner.connected) {
    console.log('nsb check...')
    await nsbSigner.blockUntilReady()
    nsbSigner.connected = true
    console.log('nsb connected')
  } else {
    console.log('nsb already connected')
  }
}

async function ensureNsbSigner(pubkey: string) {
  if (!nsbSigner) throw new Error(`NSB signer not found for ${pubkey}`)
  if (nsbSigner.connected) return
  console.log('nsb connecting for pubkey', pubkey)
  await nsbSigner.blockUntilReady()
  nsbSigner.connected = true
}

export async function nsbSignEvent(pubkey: string, event: NostrEvent): Promise<NostrEvent> {
  await ensureNsbSigner(pubkey)

  const signed = {
    ...event,
    pubkey
  }
  signed.id = getEventHash(signed)
  console.log('nsb signing event ', signed.id, 'by', pubkey)
  signed.sig = await nsbSigner.sign(signed)
  console.log('nsb signed event ', signed.id, signed.sig)

  return signed
}

export async function nsbEncrypt(pubkey: string, content: string, targetPubkey: string): Promise<string> {
  await ensureNsbSigner(pubkey)

  console.log('nsb encrypt ', content, 'for', targetPubkey)
  const enc = await nsbSigner.encrypt(new NDKUser({ npub: nip19.npubEncode(targetPubkey) }), content)
  console.log('nsb encrypted ', enc)

  return enc
}

export async function nsbDecrypt(pubkey: string, content: string, sourcePubkey: string): Promise<string> {
  await ensureNsbSigner(pubkey)

  console.log('nsb decrypt ', content, 'from', sourcePubkey)
  const dec = await nsbSigner.decrypt(new NDKUser({ npub: nip19.npubEncode(sourcePubkey) }), content)
  console.log('nsb decrypted ', dec)

  return dec
}

export async function publishEvent(event: NostrEvent) {
  await ndk.publish(new NDKEvent(ndk, event), NDKRelaySet.fromRelayUrls(writeRelays, ndk))
}

export async function fetchAppRecomms(pubkey: string): Promise<AppRecommEvent[]> {
  const ndkEvents = await fetchEventsRead(
    ndk,
    {
      kinds: [Kinds.APP_RECOMM],
      authors: [pubkey]
    },
    { cacheOnly: false }
  )

  const events = [...ndkEvents.values()].map((e) => rawEvent(e))

  const recomms: AppRecommEvent[] = []
  for (const event of events) {
    const list = createAppRecommEvent(event)
    list.naddrs = list.tags
      .filter((t: string[]) => t.length > 1 && t[0] === 'a')
      .map((a: string[]) => idToAddr(a[1]))
      .filter((addr: EventAddr | undefined) => !!addr)
      // @ts-ignore
      .map((addr: EventAddr) =>
        nip19.naddrEncode({
          pubkey: addr.pubkey || '',
          kind: addr.kind || 0,
          identifier: addr.d_tag || ''
        })
      )
    recomms.push(list)
  }
  return recomms
}

export async function publishTrustScores(
  signEvent: (event: NostrEvent) => Promise<NostrEvent>,
  pubkey: string,
  scores: { pubkey: string; score: number }[]
) {
  const e: NostrEvent = {
    kind: Kinds.TRUST_SCORES,
    pubkey,
    created_at: Math.floor(Date.now() / 1000),
    content: '',
    tags: []
  }
  scores.forEach((ps) => {
    if (ps.score > 0 && ps.score < 100) e.tags.push(['p', ps.pubkey, Number(ps.score / 100).toFixed(2)])
  })

  console.log('trust scores', e)
  const signed = await signEvent(e)
  console.log('signed trust scores', signed)
  await publishEvent(signed)
}

export async function publishAppRecommendation(
  signEvent: (event: NostrEvent) => Promise<NostrEvent>,
  pubkey: string,
  kind: number,
  naddr: string
) {
  let list = (await fetchEventByAddr(ndk, {
    kind: Kinds.APP_RECOMM,
    pubkey,
    d_tag: `${kind}`
  })) as NostrEvent

  if (list === null)
    list = {
      kind: Kinds.APP_RECOMM as number,
      pubkey,
      created_at: Math.floor(Date.now() / 1000),
      content: '',
      tags: [['d', `${kind}`]]
    }

  const appAddr = parseAddr(naddr)
  if (!appAddr) throw new Error('Bad naddr')

  const a = appAddr.kind + ':' + appAddr.pubkey + ':' + appAddr.d_tag
  console.log('adding to list', a)
  if (
    !list.tags.find((t: string[]) => {
      return t.length >= 4 && t[0] === 'a' && t[1] === a && t[3] === 'web'
    })
  ) {
    list.tags.push(['a', a, nostrbandRelay, 'web'])
  }

  // update
  list.id = ''
  list.sig = ''
  list.created_at = Math.floor(Date.now() / 1000)

  const signed = await signEvent(list)
  console.log('signed list', signed)
  await publishEvent(signed)
}

async function checkReconnect(ndk: NDK, force: boolean = false) {
  if (!ndk) return

  // how do we check the connectivity?
  let reconnected = false
  const relays = [...ndk.pool.relays.values()]
  for (const r of relays) {
    const alive = force
      ? false
      : await new Promise((ok) => {
          const sub = ndk.subscribe(
            {
              kinds: [0, 1, 3],
              limit: 1
            },
            {
              closeOnEose: true
            },
            new NDKRelaySet(new Set([r]), ndk),
            /* autoStart */ false
          )

          let alive = false
          // eslint-disable-next-line
          sub.on('event', (e: any) => {
            console.log('checkReconnect', r.url, 'got event', e.id)
            alive = true
          })
          sub.on('eose', () => {
            console.log('checkReconnect', r.url, 'alive', alive)
            ok(alive)
          })
          sub.start()
        })

    if (!alive) {
      console.log('reconnecting', r.url)
      reconnected = true
      ndk.pool.removeRelay(r.url)
      const newRelay = new NDKRelay(r.url)
      ndk.pool.addRelay(newRelay, /*connect*/ false)
      await newRelay.connect()
    }
  }

  if (reconnected) {
    profileSub.onReconnect()
    contactListSub.onReconnect()
  }
}

export function isConnected() {
  return !!ndk
}

export function nostrOnResume() {
  checkReconnect(ndk)
  checkReconnect(nsbNDK)
}

export function reconnect() {
  showToast(`Reconnecting...`)
  checkReconnect(ndk, true)
  checkReconnect(nsbNDK, true)
}

// localStorage.debug = ''
