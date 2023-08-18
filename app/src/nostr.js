import NDK, { NDKRelaySet } from "@nostrband/ndk";
import { nip19 } from "@nostrband/nostr-tools";

const KIND_META = 0;
const KIND_APP = 31990;

// we only care about web apps
const PLATFORMS = ["web"];

const ADDR_TYPES = ['', 'npub', 'note', 'nevent', 'nprofile', 'naddr'];

export const nostrbandRelay = "wss://relay.nostr.band/";
export const nostrbandRelayCounts = "wss://relay.nostr.band/all";

const readRelays = [
  nostrbandRelay,
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.nostr.bg",
  "wss://nostr.mom",
];
const writeRelays = [...readRelays, "wss://nostr.mutinywallet.com"]; // for broadcasting
export const allRelays = [nostrbandRelayCounts, ...writeRelays];

// global ndk instance for now
let ndk = null;

const kindApps = {};

function fetchEventsRead(ndk, filter) {
  return ndk.fetchEvents(filter, NDKRelaySet.fromRelayUrls(readRelays, ndk));
}

function getTags(e, name) {
  return e.tags.filter((t) => t.length > 0 && t[0] === name);
}

function getTag(e, name) {
  const tags = getTags(e, name);
  if (tags.length === 0) return null;
  return tags[0];
}

function getTagValue(e, name, index, def) {
  const tag = getTag(e, name);
  if (tag === null || !tag.length || (index && index >= tag.length))
    return def !== undefined ? def : '';
  return tag[1 + (index || 0)];
}

function getEventTagA(e) {
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

    if (Object.keys(handlers).length == 0)
      return;

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
      author,
      kinds,
      handlers,
    };

    apps.push(app);
  });

  return apps;
}

const parseAddr = (id) => {
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

export async function subscribeProfiles(pubkeys, cb) {
  const sub = await ndk.subscribe(
    {
      authors: [...pubkeys],
      kinds: [KIND_META],
    },
    {
      // FIXME not great for privacy
      // use of the same subId allows us to avoid sending
      // close to cancel the last sub
      subId: "profiles",
    },
    NDKRelaySet.fromRelayUrls(readRelays, ndk),
    /* autoStart */ false
  );

  sub.on("event", (event) => {
    const profile = {
      id: event.id,
      pubkey: event.pubkey,
      kind: event.kind,
      tags: event.tags,
      created_at: event.created_at,
      content: event.content,
      profile: parseContentJson(event.content),
    };
    console.log("got profile", profile);
    cb(profile);
  });

  sub.start();

//  console.log("subscribe to profiles", JSON.stringify(pubkeys));
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
