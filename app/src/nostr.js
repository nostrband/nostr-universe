import NDK, { NDKRelaySet } from "@nostrband/ndk";
import { nip19 } from "@nostrband/nostr-tools";
import { decode as bolt11Decode } from "light-bolt11-decoder";

const KIND_META = 0;
const KIND_NOTE = 1;
const KIND_CONTACT_LIST = 3;
const KIND_COMMUNITY_APPROVAL = 4550;
const KIND_ZAP = 9735;
const KIND_HIGHLIGHT = 9802;
const KIND_LONG_NOTE = 30023;
const KIND_APP = 31990;
const KIND_LIVE_EVENT = 30311;
const KIND_COMMUNITY = 34550;

// we only care about web apps
const PLATFORMS = ["web"];

const ADDR_TYPES = ['', 'npub', 'note', 'nevent', 'nprofile', 'naddr'];

export const nostrbandRelay = "wss://relay.nostr.band/";
export const nostrbandRelayCounts = "wss://relay.nostr.band/all";

const readRelays = [
  nostrbandRelay,
  //  "wss://relay.damus.io", // too slow
  "wss://eden.nostr.land",
  "wss://nos.lol",
  "wss://relay.nostr.bg",
  "wss://nostr.mom",
];
const writeRelays = [...readRelays, "wss://nostr.mutinywallet.com"]; // for broadcasting
export const allRelays = [nostrbandRelayCounts, ...writeRelays];

// global ndk instance for now
let ndk = null;

const kindApps = {};
const profileCache = [];

function fetchEventsRead(ndk, filter) {
  return ndk.fetchEvents(filter, {}, NDKRelaySet.fromRelayUrls(readRelays, ndk));
}

export function getTags(e, name) {
  return e.tags.filter((t) => t.length > 0 && t[0] === name);
}

export function getTag(e, name) {
  const tags = getTags(e, name);
  if (tags.length === 0) return null;
  return tags[0];
}

export function getTagValue(e, name, index, def) {
  const tag = getTag(e, name);
  if (tag === null || !tag.length || (index && index >= tag.length))
    return def !== undefined ? def : '';
  return tag[1 + (index || 0)];
}

export function getEventTagA(e) {
  let addr = e.kind + ':' + e.pubkey + ':';
  if (e.kind >= 30000 && e.kind < 40000) addr += getTagValue(e, 'd');
  return addr;
}

function parseContentJson(c) {
  try {
    return JSON.parse(c);
  } catch (e) {
    console.log("Bad json: ", c, e);
    return {};
  }
}

function isWeb(e) {
  for (const t of e.tags) {
    if (t[0] === "web")
      return true;

    if (t[0] === "android"
	|| t[0] === "ios"
	|| t[0] === "windows"
	|| t[0] === "macos"
	|| t[0] === "linux"
    )
      return false;
  }

  return true;
}

function findHandlerUrl(e, k) {
  for (const t of e.tags) {
    if (t[0] !== "web" || t.length < 3) continue;

    if (k === KIND_META && (t[2] === "npub" || t[2] === "nprofile")) {
      return [t[1], t[2]];
    }

    if (k >= 30000 && k < 40000 && t[2] === "naddr") {
      return [t[1], t[2]];
    }

    return [t[1], t[2]];
  }

  return null;
}

export async function fetchApps() {
  // try to fetch best apps list from our relay
  const top = await ndk.fetchTop(
    {
      kinds: [KIND_APP],
      limit: 50,
    },
    NDKRelaySet.fromRelayUrls([nostrbandRelay], ndk)
  );
  console.log("top apps", top?.ids.length);

  let events = null;
  if (top.ids.length) {
    // fetch the app events themselves from the list
    events = await fetchEventsRead(
      ndk,
      {
        ids: top.ids,
      }
    );
  } else {
    console.log("top apps empty, fetching new ones");
    // load non-best apps from other relays just to avoid
    // completely breaking the UX due to our relay being down
    events = await fetchEventsRead(
      ndk,
      {
        kinds: [KIND_APP],
        limit: 50,
      }
    );
  }
  events = [...events.values()];
  console.log("top app events", events.length);

  // load authors of the apps, we need them both for the app
  // info and for apps that inherit the author's profile info
  let profiles = await fetchEventsRead(
    ndk,
    {
      authors: events.map((e) => e.pubkey),
      kinds: [KIND_META],
    }
  );
  profiles = [...profiles.values()];

  // assign order to the apps, sort by top or by published date
  if (top)
    top.ids.forEach((id, i) => {
      const e = events.find((e) => e.id == id);
      if (e) e.order = top.ids.length - i;
    });
  else events.forEach((e, i) => (e.order = Number(getTagValue(e, "published_at"))));

  // sort events by order desc
  events.sort((a, b) => b.order - a.order);

  // convert to a convenient app object
  const apps = [];
  events.forEach((e) => {
    // app author
    const author = profiles.find((p) => p.pubkey == e.pubkey);

    // app profile - it's own, or inherited from the author
    const profile = e.content ? parseContentJson(e.content) : parseContentJson(author ? author.content : "");

    // app's handled kinds and per-kind handler urls for the 'web' platform,
    // we don't add a kind that doesn't have a proper handler
    const kinds = [];
    const handlers = {};
    e.tags.forEach((t) => {
      let k = 0;
      if (t.length < 2 || t[0] != "k") return;

      try {
        k = parseInt(t[1]);
      } catch (e) {
        return;
      }

      const url_type = findHandlerUrl(e, k);
      if (!url_type) return;

      kinds.push(k);
      handlers[k] = {
        url: url_type[0],
        type: url_type[1],
      };
    });

    if (!isWeb(e))
      return;
    
    //    if (Object.keys(handlers).length == 0)
    //      return;
    
    const app = {
      naddr: nip19.naddrEncode({
        pubkey: e.pubkey,
        kind: e.kind,
        identifier: getTagValue(e, "d"),
      }),
      name: profile ? profile.display_name || profile.name : "<Noname app>",
      url: (profile && profile.website) || "",
      picture: (profile && profile.picture) || "",
      about: (profile && profile.about) || "",
      kinds,
      handlers,
    };

    if (app.name && app.url)
      apps.push(app);
  });

  return apps;
}

export function parseAddr(id) {
  let addr = {
    kind: undefined,
    pubkey: undefined,
    event_id: undefined,
    d_tag: undefined,
    relays: undefined,
    hex: false,
  };

  try {
    const { type, data } = nip19.decode(id);

    switch (type) {
      case 'npub':
        addr.kind = 0;
        addr.pubkey = data;
        break;
      case 'nprofile':
        addr.kind = 0;
        addr.pubkey = data.pubkey;
        addr.relays = data.relays;
        break;
      case 'note':
        addr.event_id = data;
        break;
      case 'nevent':
        addr.event_id = data.id;
        addr.relays = data.relays;
        addr.pubkey = data.author;
        // FIXME add support for kind to nevent to nostr-tool
        break;
      case 'naddr':
        addr.d_tag = data.identifier || '';
        addr.kind = data.kind;
        addr.pubkey = data.pubkey;
        addr.relays = data.relays;
        break;
      default:
        throw 'bad id';
    }
  } catch (e) {
    if (id.length === 64) {
      addr.event_id = id;
      addr.hex = true;
    } else {
      console.error('Failed to parse addr', e);
      return null;
    }
  }

  return addr;
};

function dedupEvents(events) {
  const map = {};
  for (const e of events) {
    let addr = e.id;
    if (
      e.kind === 0 ||
      e.kind === 3 ||
      (e.kind >= 10000 && e.kind < 20000) ||
      (e.kind >= 30000 && e.kind < 40000)
    ) {
      addr = getEventTagA(e);
    }
    if (!(addr in map) || map[addr].created_at < e.created_at) {
      map[addr] = e;
    }
  }
  return Object.values(map);
}

async function collectEvents(reqs) {
  const results = await Promise.allSettled(Array.isArray(reqs) ? reqs : [reqs]);
  let events = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      if (r.value !== null) {
        if (typeof r.value[Symbol.iterator] === 'function')
          events.push(...r.value);
        else events.push(r.value);
      }
    }
  }
  return dedupEvents(events);
}

async function fetchEventByAddr(ndk, addr) {

  const filter = {};
  if (addr.event_id) {
    // note, nevent
    filter.ids = [addr.event_id];
  } else if (
    addr.pubkey &&
    addr.d_tag !== undefined &&
    addr.kind !== undefined
  ) {
    // naddr
    filter['#d'] = [addr.d_tag];
    filter.authors = [addr.pubkey];
    filter.kinds = [addr.kind];
  } else if (addr.pubkey && addr.kind !== undefined) {
    // npub, nprofile
    filter.authors = [addr.pubkey];
    filter.kinds = [addr.kind];
  }
  console.log("loading event by filter", JSON.stringify(filter));

  const reqs = [fetchEventsRead(ndk, filter)];
  if (addr.hex) {
    const profileFilter = {
      kinds: [0],
      authors: [addr.event_id],
    };
    // console.log("loading profile by filter", profile_filter);
    reqs.push(fetchEventsRead(ndk, profileFilter));
  }

  const events = await collectEvents(reqs);
  return events.length > 0 ? events[0] : null;
}

function prepareHandlers(events, filterKinds, metaPubkey) {
  const info = {
    meta: null,
    apps: {},
  };

  const metas = {};
  for (const e of events) {
    if (e.kind === KIND_META) {
      metas[e.pubkey] = e;

      e.profile = parseContentJson(e.content);

      if (metaPubkey && metaPubkey === e.pubkey) info.meta = e;
    }
  }

  for (const e of events) {
    if (e.kind !== KIND_APP)
      continue;

    // set naddr
    e.naddr = nip19.naddrEncode({
      pubkey: e.pubkey,
      kind: e.kind,
      identifier: getTagValue(e, "d"),
    });

    // init handler profile, inherit from pubkey meta if needed
    e.inheritedProfile = !e.content;
    e.meta = e.pubkey in metas ? metas[e.pubkey] : null;
    if (e.inheritedProfile) e.profile = e.meta?.profile || {};
    else e.profile = parseContentJson(e.content);

    // parse handler kinds
    const kinds = new Set();
    for (const t of getTags(e, 'k')) {
      if (t.length < 2)
	continue;
      const k = Number(t[1]);
      if (k < 0 || k > 10000000 || isNaN(k))
	continue;
      kinds.add(k);
    }
    e.kinds = [...kinds];

    // drop handlers that don't handle our kinds
    if (filterKinds && filterKinds.length)
      e.kinds = e.kinds.filter(k => filterKinds.includes(k));
    if (!e.kinds.length)
      continue;

    // parse platforms and urls
    const ps = {};
    e.urls = [];
    for (const p of PLATFORMS) {

      // urls for platform p
      const urls = getTags(e, p);
      for (const url of urls) {
        if (url.length < 2)
	  continue;

        const type = url.length > 2 ? url[2] : '';

	// default or one of known types?
        if (type != "" && !ADDR_TYPES.find(t => t === type))
	  continue;

        ps[p] = 1;
        e.urls.push({
          url: url[1],
          type,
        });
      }
    }
    e.platforms = Object.keys(ps);
    
    // dedup by app name
    e.app_id = getTagValue(e, 'd');
    if (e.content !== '')
      e.app_id = e.profile.name || e.profile.display_name || '';

    // init 
    if (!(e.app_id in info.apps)) {
      info.apps[e.app_id] = {
        app_id: e.app_id,
        handlers: [],
        kinds: [],
        platforms: [],
      };
    }

    // add app handler
    const app = info.apps[e.app_id];
    app.handlers.push(e);
    app.kinds.push(...e.kinds);
    app.platforms.push(...e.platforms);
  }

  return info;
}

async function fetchAppsByKinds(ndk, kinds) {

  // fetch apps ('handlers')
  const filter = {
    kinds: [KIND_APP],
    limit: 50,
  };
  if (kinds && kinds.length > 0) filter['#k'] = kinds.map((k) => '' + k);

//  let events = await collectEvents(fetchEventsRead(ndk, filter));
//  console.log('events', events);

  const top = await ndk.fetchTop(filter, NDKRelaySet.fromRelayUrls([nostrbandRelay], ndk))
  console.log("top kind apps", top?.ids.length);

  let events = null;
  if (top.ids.length) {
    // fetch the app events themselves from the list
    events = await collectEvents(fetchEventsRead(ndk, { ids: top.ids }));
  } else {
    console.log("top apps empty, fetching new ones");
    // load non-best apps from other relays just to avoid
    // completely breaking the UX due to our relay being down
    events = await collectEvents(fetchEventsRead(ndk, filter));
  }
//  console.log('events', events);

  if (top)
    top.ids.forEach((id, i) => {
      const e = events.find((e) => e.id == id);
      if (e) e.order = top.ids.length - i;
    });
  else events.forEach((e, i) => (e.order = Number(getTagValue(e, "published_at"))));
  
  // fetch app profiles
  const pubkeys = {};
  for (const e of events) pubkeys[e.pubkey] = 1;

  // we need profiles in case app info inherits content
  // from it's profile
  if (events.length > 0) {
    const metas = await collectEvents(
      fetchEventsRead(ndk, {
        kinds: [KIND_META],
        authors: Object.keys(pubkeys),
      }),
    );
//    console.log('metas', metas);

    events = [...events, ...metas];
  }

  // parse
  const info = prepareHandlers(events, kinds);
  return info;
}

function getUrl(app, ad) {

  const findUrlType = (type) => {
    return app.urls.find((u) => u.type === type);
  };

  const allUrl = findUrlType('');

  const findUrl = (id) => {
    const { type } = nip19.decode(id);
    const u = findUrlType(type) || allUrl;
    if (u != null) return u.url.replace('<bech32>', id);
    return null;
  };

  const naddrId = {
    identifier: ad.d_tag || '',
    pubkey: ad.pubkey,
    kind: ad.kind,
    relays: ad.relays,
  };
  const neventId = {
    // FIXME add kind!
    id: ad.event_id,
    relays: ad.relays,
    author: ad.pubkey,
  };

  let url = '';
  if (ad.kind === 0) {
    if (!url && ad.pubkey)
      url = findUrl(nip19.npubEncode(ad.pubkey))
	 || findUrl(nip19.nprofileEncode({ pubkey: ad.pubkey, relays: ad.relays }))
      // || findUrl(nip19.naddrEncode(naddrId))
    ;
    if (!url && ad.event_id)
      url = findUrl(nip19.neventEncode(neventId)) 
	 || findUrl(nip19.noteEncode(ad.event_id))
    ;
  } else if (
    ad.kind === 3 ||
    (ad.kind >= 10000 && ad.kind < 20000)
  ) {
    // specific order - naddr preferred
    url =
      // FIXME naddr?
      findUrl(nip19.neventEncode(neventId)) ||
      findUrl(nip19.noteEncode(ad.event_id));
  } else if (
    (ad.kind >= 30000 && ad.kind < 40000)
  ) {
    // specific order - naddr preferred
    url =
      findUrl(nip19.naddrEncode(naddrId));
    if (!url && ad.event_id)
      url = findUrl(nip19.neventEncode(neventId))
	 || findUrl(nip19.noteEncode(ad.event_id))
    ;
  } else {
    // specific order - naddr preferred
    url =
      findUrl(nip19.neventEncode(neventId)) ||
      findUrl(nip19.noteEncode(ad.event_id));
  }

  return url;
};

export async function fetchAppsForEvent(id, event) {
  const addr = parseAddr(id);
  if (!addr)
    throw new Error("Bad address");

  // if event content is known take kind from there
  if (event && addr.kind === undefined)
    addr.kind = event.kind;

  // if kind unknown need to fetch event from network 
  if (addr.kind === undefined) {
    if (!event)
      event = await fetchEventByAddr(ndk, addr);

    if (!event)
      throw new Error("Failed to fetch target event");
    
    addr.kind = event.kind;
    addr.event_id = event.id;
    addr.pubkey = event.pubkey;
    if (event.kind >= 30000 && event.kind < 40000) {
      addr.d_tag = getTagValue(event, 'd');
    }    
  }
  console.log('resolved addr', addr);
  
  // now fetch the apps for event kind
  const info = addr.kind in kindApps
	     ? {...kindApps[addr.kind]}
	     : await fetchAppsByKinds(ndk, [addr.kind]);
  info.addr = addr;

  // put to cache
  kindApps[addr.kind] = info;

  // init convenient url property for each handler
  // to redirect to this event
  for (const id in info.apps) {
    const app = info.apps[id];
    for (const h of app.handlers) {
      h.eventUrl = getUrl(h, addr);
    }
  }
    
  return info;
}

export async function fetchEventByBech32(b32) {
  const addr = parseAddr(b32);
  console.log("b32", b32, "addr", JSON.stringify(addr));
  if (!addr)
    throw new Error("Bad address");

  return await fetchEventByAddr(ndk, addr);
}

export async function searchProfiles(q) {
  // try to fetch best profiles from our relay
  const top = await ndk.fetchTop(
    {
      kinds: [KIND_META],
      search: q,
      limit: 30,
    },
    NDKRelaySet.fromRelayUrls([nostrbandRelay], ndk)
  );
  console.log("top profiles", top?.ids.length);

  let events = [];
  if (top.ids.length) {
    // fetch the app events themselves from the list
    events = await fetchEventsRead(
      ndk,
      {
        ids: top.ids,
      }
    );
  }

  events.forEach(e => {
    e.profile = parseContentJson(e.content);
    e.profile.pubkey = e.pubkey;
    e.profile.npub = nip19.npubEncode(e.pubkey);
    e.order = top.ids.findIndex(i => e.id === i);
  });

  events.sort((a, b) => a.order - b.order);

  return events;
}

function rawEvent(e) {
  return {
    id: e.id,
    pubkey: e.pubkey,
    created_at: e.created_at,
    kind: e.kind,
    tags: e.tags,
    content: e.content,
    identifier: getTagValue(e, 'd'),
    order: e.created_at
  };
}

async function fetchMetas(pubkeys) {
  let metas = await collectEvents(
    fetchEventsRead(ndk, {
      kinds: [KIND_META],
      authors: pubkeys,
    }),
  );

  // drop ndk stuff
  metas = metas.map(m => rawEvent(m));
  
  // parse profiles
  metas.forEach(e => {
    e.profile = parseContentJson(e.content);
    e.profile.pubkey = e.pubkey;
    e.profile.npub = nip19.npubEncode(e.pubkey);
  });

  return metas;
}

async function augmentPrepareEvents(events, limit) {

  if (events.length > 0) {
    // profile infos
    const metas = await fetchMetas(events.map(e => e.pubkey));

    // assign to notes
    events.forEach(e => e.author = metas.find(m => m.pubkey === e.pubkey));
  }

  // desc by tm
  events.sort((a, b) => b.order - a.order);

  if (events.length > limit)
    events.length = limit;

  return events;
}

async function fetchEventsByIds(opts) {

  const {ids, kinds, augment} = opts;
  
  if (!ids.length)
    return [];

  let events = await ndk.fetchEvents(
    {
      ids,
      kinds,
    },
    {}, // opts
    NDKRelaySet.fromRelayUrls([nostrbandRelay], ndk)
  );
  console.log("ids", ids, "kinds", kinds, "events", events);

  events = [...events.values()].map(e => rawEvent(e));  
  if (augment)
    events = await augmentPrepareEvents(events, events.length);

  console.log("events by ids prepared", events);

  return events;
}

async function augmentLongNotes(events) {
  events.forEach((e) => {
    e.title = getTagValue(e, 'title');
    e.summary = getTagValue(e, 'summary');
    e.published_at = Number(getTagValue(e, 'published_at'));
  });
  return events;
}

async function augmentZaps(events, minZap) {

  events.forEach((e) => {
    e.description = parseContentJson(getTagValue(e, "description"));
    try {
      e.bolt11 = bolt11Decode(getTagValue(e, "bolt11"));      
    } catch {
      e.bolt11 = {};
    };
    e.amountMsat = Number(e.bolt11?.sections.find(s => s.name === 'amount').value);
    e.targetEventId = getTagValue(e, 'e');
    e.targetAddr = getTagValue(e, 'a');
    e.targetPubkey = getTagValue(e, 'p');
    e.providerPubkey = e.pubkey;
    e.senderPubkey = e.description?.pubkey;
  });

  // drop zaps w/o a target event
  events = events.filter(e => !!e.targetEventId);
  
  if (minZap) {
    events = events.filter(e => e.amountMsat / 1000 >= minZap);
  }

  if (events.length > 0) {
    // target event infos
    const ids = events.map(e => e.targetEventId).filter(id => !!id);
    let targets = await fetchEventsByIds({
      ids,
      kinds: [KIND_NOTE, KIND_LONG_NOTE, KIND_COMMUNITY, KIND_LIVE_EVENT, KIND_APP],
      augment: false
    });

    // profile infos
    const pubkeys = new Set();
    events.forEach(e => {
      pubkeys.add(e.providerPubkey);
      if (e.targetPubkey)
	pubkeys.add(e.targetPubkey);
      if (e.senderPubkey)
	pubkeys.add(e.senderPubkey);
    });
    console.log("zap meta pubkeys", pubkeys);
    const metas = await fetchMetas([...pubkeys.values()]);
    
    // assign to zaps
    events.forEach(e => {
      e.targetEvent = targets.find(t => t.id === e.targetEventId);
      e.targetMeta = metas.find(m => m.pubkey === e.targetPubkey);
      e.providerMeta = metas.find(m => m.pubkey === e.providerPubkey);
      e.senderMeta = metas.find(m => m.pubkey === e.senderPubkey);
    });
  }

  // desc 
  events.sort((a, b) => b.order - a.order);
  
  return events;
}

async function augmentCommunities(events, addrs) {
  events.forEach((e) => {
    e.name = e.identifier;
    e.description = getTagValue(e, 'description');
    e.image = getTagValue(e, 'image');
    e.moderators = getTags(e, 'p')
      .filter(p => p.length >= 4 && p[3] === 'moderator')
      .map(p => p[1]);

    const apprs = addrs.filter(a => a.pubkey === e.pubkey && a.identifier === e.identifier);
    e.last_post_tm = apprs[0].tm;
    e.order = apprs[0].tm;
    e.posts = apprs.length;
  });

  // desc
  events.sort((a, b) => b.order - a.order);
  
  return events;
}

async function searchEvents(q, kind, limit = 30) {
  let events = await ndk.fetchEvents(
    {
      kinds: [kind],
      search: q,
      limit,
    },
    {}, // opts
    NDKRelaySet.fromRelayUrls([nostrbandRelay], ndk)
  );
  events = [...events.values()].map(e => rawEvent(e));  

  console.log("notes", events);

  events = await augmentPrepareEvents(events, limit);

  console.log("notes prepared", events);

  return events;
}

export async function searchNotes(q, limit = 30) {
  return searchEvents(q, KIND_NOTE, limit);
}

export async function searchLongNotes(q, limit = 30) {
  let events = await searchEvents(q, KIND_LONG_NOTE, limit);
  events = await augmentLongNotes(events);
  return events;
}

function onUniqueEvent(sub, cb) {

  // call cb on each event
  const events = new Map();
  sub.on("event", (event) => {

    // dedup
    const dedupKey = event.deduplicationKey();
    const existingEvent = events.get(dedupKey);
    // console.log("dedupKey", dedupKey, "existingEvent", existingEvent?.created_at, "event", event.created_at);
    if (existingEvent?.created_at > event.created_at) {
      return;
    }
    events.set(dedupKey, event);

    cb(event);
  });
}

// used for handling a sequence of events and an eose after them,
// since each event-handling callback might be async we have to execute
// them one by one through a queue to ensure eose marker comes last
class PromiseQueue {

  queue = [];
  
  constructor() {
  }

  appender(cb) {
    return (...args) => {
      this.queue.push([cb, [...args]]);
      if (this.queue.length === 1)
	this.execute();
    }
  }

  async execute() {
    // the next cb in the queue
    const [cb, args] = this.queue[0];

    // execute the next cb
    await cb(...args);

    // mark the last cb as done
    this.queue.shift();

    // have the next one? proceed
    if (this.queue.length > 0)
      this.execute();
  }
};

async function fetchPubkeyEvents(opts) {

  let { kind, pubkeys, tagged = false, augment = false, limit = 30 } = opts;

  const authors = [...pubkeys];
  if (authors.length > 200)
    authors.length = 200;

  const filter = {
    kinds: [kind],
    limit,
  };

  if (tagged)
    filter['#p'] = authors;
  else
    filter.authors = authors;

  if (opts.identifiers)
    filter['#d'] = opts.identifiers;
  
  let events = await fetchEventsRead(ndk, filter);
  console.log("kind", kind, "new events", events);

  events = [...events.values()].map(e => rawEvent(e));  
  if (augment)
    events = await augmentPrepareEvents(events, limit);

  return events;
}

export async function fetchFollowedLongNotes(contactPubkeys) {
  let events = await fetchPubkeyEvents({
    kind: KIND_LONG_NOTE,
    pubkeys: contactPubkeys,
    augment: true
  });
  events = await augmentLongNotes(events);
  return events;
}

export async function fetchFollowedHighlights(contactPubkeys) {
  let events = await fetchPubkeyEvents({
    kind: KIND_HIGHLIGHT,
    pubkeys: contactPubkeys,
    augment: true
  });
//  events = await augmentLongNotes(events);
  return events;
}

export async function fetchFollowedZaps(contactPubkeys, minZap) {
  let events = await fetchPubkeyEvents({
    kind: KIND_ZAP,
    pubkeys: contactPubkeys,
    tagged: true,
    limit: 200,
  });
  events = await augmentZaps(events, minZap);
  return events;
}

export async function fetchFollowedCommunities(contactPubkeys) {
  const approvals = await fetchPubkeyEvents({
    kind: KIND_COMMUNITY_APPROVAL,
    pubkeys: contactPubkeys,
    limit: 100
  });

  // desc
  approvals.sort((a, b) => b.order - a.order);
//  console.log("approvals", approvals);  

  const addrs = approvals.map(e => { return { tm: e.created_at, p: getTagValue(e, 'a').split(':') } } )
    .filter(a => a.p.length == 3 && Number(a.p[0]) === KIND_COMMUNITY)
    .map(a => { return { tm: a.tm, pubkey: a.p[1], identifier: a.p[2] } });
//  console.log("addrs", addrs);

  let events = await fetchPubkeyEvents({
    kind: KIND_COMMUNITY,
    pubkeys: [... new Set(addrs.map(a => a.pubkey))],
    identifiers: [... new Set(addrs.map(a => a.identifier))],
    augment: true,
  });
  
  events = await augmentCommunities(events, addrs);
  console.log("communities", events);
  return events;
}

async function augmentLiveEvents(events, contactPubkeys, limit) {

  // convert to an array of raw events

  const MAX_LIVE_TTL = 3600;
  events.forEach(e => {
    e.title = getTagValue(e, 'title');
    e.summary = getTagValue(e, 'summary');
    e.starts = Number(getTagValue(e, 'starts'));
    e.current_participants = Number(getTagValue(e, 'current_participants'));
    e.status = getTagValue(e, 'status');

    // NIP-53: Clients MAY choose to consider status=live events
    // after 1hr without any update as ended.
    if ((Date.now() / 1000 - e.created_at) > MAX_LIVE_TTL)
      e.status = 'ended';

    const ps = getTags(e, 'p');
    e.host = ps.find(p => p.length >= 4 && (p[3] === 'host' || p[3] === 'Host'))?.[1];
    e.members = ps
      .filter(p => p.length >= 4 && contactPubkeys.includes(p[1]))
      .map(p => p[1]);

    // newest-first
    e.order = e.starts;

    // reverse order of all non-live events and make
    // them go after live ones
    if (e.status !== 'live')
      e.order = -e.order; 
  });

  // drop ended ones
  events = events.filter(e => {
    return !!e.host
    // For now let's show live events where some of our following are participating
    //	&& contactPubkeys.includes(e.host)
	&& e.status !== 'ended';
  });

  if (events.length > 0) {
    // profile infos
    const metas = await fetchMetas(events.map(e => [e.pubkey, ...e.members]).flat());
    
    // assign to live events
    events.forEach(e => {
      e.author = metas.find(m => m.pubkey === e.pubkey); // provider
      e.hostMeta = e.host ? metas.find(m => m.pubkey === e.host) : null; // host
      e.membersMeta = metas.filter(m => e.members.includes(m.pubkey)); // all members: host, speakers, participants
    });
  }

  // desc 
  events.sort((a, b) => b.order - a.order);
  
  // crop
  if (events.length > limit)
    events.length = limit;

  return events;
}

export async function fetchFollowedLiveEvents(contactPubkeys, limit = 30) {

  let events = await fetchPubkeyEvents({
    kind: KIND_LONG_NOTE,
    pubkeys: contactPubkeys,
    tagged: true
  });

  events = await augmentLiveEvents(events, contactPubkeys, limit);
  
  return events;
}

let profilesSub = null;
export async function subscribeProfiles(pubkeys, cb) {

  // gc
  if (profilesSub) {
    profilesSub.stop();
    profilesSub = null;
  }
  
  const sub = await ndk.subscribe(
    {
      authors: [...pubkeys],
      kinds: [KIND_META],
    },
    {},
    NDKRelaySet.fromRelayUrls(readRelays, ndk),
    /* autoStart */ false
  );

  // ensure async callbacks are executed one by one
  const pq = new PromiseQueue();
  
  // call cb on each unique newer event
  onUniqueEvent(sub, pq.appender(async (event) => {
    // convert to raw event
    const profile = rawEvent(event);
    profile.profile = parseContentJson(event.content);

    console.log("got profile", profile);
    await cb(profile);
  }));

  // notify that initial fetch is over
  sub.on("eose", pq.appender(async () => await cb(null)));

  // start
  sub.start();

  // store
  profilesSub = sub;
}

let clSub = null;
export async function subscribeContactList(pubkey, cb) {

  // gc
  if (clSub) {
    clSub.stop();
    clSub = null;
  }
  
  const sub = await ndk.subscribe(
    {
      authors: [pubkey],
      kinds: [KIND_CONTACT_LIST],
    },
    {},
    NDKRelaySet.fromRelayUrls(readRelays, ndk),
    /* autoStart */ false
  );

  // ensure async callbacks are executed one by one
  const pq = new PromiseQueue();
  
  // call cb on each unique newer event
  let eose = false;
  let lastCL = null;

  const returnLastCL = async () => {
    
    const event = lastCL;

    const contactList = rawEvent(event);
    // extract and dedup pubkeys
    contactList.contactPubkeys = [...new Set(
      event.tags
	   .filter(t => t.length >= 2 && t[0] === 'p')
	   .map(t => t[1])
    )];
    contactList.contactEvents = [];

    if (contactList.contactPubkeys.length) {
      contactList.contactEvents = await collectEvents(
	fetchEventsRead(ndk, {
          kinds: [KIND_META],
          authors: contactList.contactPubkeys,
	}),
      );

      contactList.contactEvents.forEach(p => {
	p.profile = parseContentJson(p.content);
	p.profile.pubkey = p.pubkey;
	p.profile.npub = nip19.npubEncode(p.pubkey);
	p.order = contactList.contactPubkeys.findIndex(pk => pk == p.pubkey);
      });

      // desc
      contactList.contactEvents.sort((a, b) => b.order - a.order);
    }
    
    console.log("got contact list", contactList);
    await cb(contactList);
  };
  
  onUniqueEvent(sub, pq.appender(async (event) => {
    lastCL = event;
    if (eose)
      await returnLastCL();
  }));

  // notify that initial fetch is over
  sub.on("eose", pq.appender(async () => {
    eose = true;
    if (lastCL)
      await returnLastCL();

    // notify about eose
    await cb(null)
  }));

  // start
  sub.start();

  // store
  clSub = sub;
}

export function stringToBech32(s, hex = false) {

  const BECH32_REGEX =
    /[a-z]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/g;
    
  const array = [...s.matchAll(BECH32_REGEX)].map(a => a[0]);

  let bech32 = "";
  for (let b32 of array) {
    try {
      const { type, data } = nip19.decode(b32);
      //      console.log("b32", b32, "type", type, "data", data);
      switch (type) {
        case "npub":
        case "nprofile":
        case "note":
        case "nevent":
        case "naddr":
          bech32 = b32;
          break;
      }
    } catch (e) {
      console.log("bad b32", b32, "e", e);
    }

    if (bech32)
      return bech32;
  }

  if (hex) {
    if (s.length == 64 && s.match(/0-9A-Fa-f]{64}/g))
      return s;
  }

  return "";
}

export function createAddrOpener(cb) {
  return (event) => {
    let addr = event.id;

    if (event.kind === KIND_META) {
      // npub
      addr = nip19.npubEncode(event.pubkey);
    } else if (
      (event.kind >= 10000 && event.kind < 20000)
      || (event.kind >= 30000 && event.kind < 40000)
    ) {
      // naddr
      addr = nip19.naddrEncode({
	pubkey: event.pubkey,
	kind: event.kind,
	identifier: getTagValue(event, 'd'),
	relays: [nostrbandRelay],
      });
    } else {
      // nevent
      addr = nip19.neventEncode({
	id: event.id,
	relays: [nostrbandRelay],
      });
    }

    console.log("addr", addr);
    cb(addr);
  };
}

export function connect() {
  
  ndk = new NDK({ explicitRelayUrls: allRelays });

  return ndk.connect(/* timeoutMs */ 1000, /* minConns */ 3);
}

export function launchZapDialog(id, event) {
  const d = document.createElement("div");
  d.setAttribute("data-npub", nip19.npubEncode(event.pubkey));
  if (event.kind != 0)
    d.setAttribute("data-note-id", nip19.noteEncode(event.id));
  window.nostrZap.initTarget(d);
  d.click();
  d.remove();
}
