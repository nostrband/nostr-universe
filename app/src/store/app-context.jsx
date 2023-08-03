import React, { useEffect, useState } from "react";
import { keystore } from "../keystore";
import {
  addPin,
  addTab,
  db,
  deletePin,
  deleteTab,
  getFlag,
  listPins,
  listTabs,
  setFlag,
  updateTab,
} from "../db";
import {
  coracleIcon,
  irisIcon,
  nostrIcon,
  satelliteIcon,
  snortIcon,
} from "../assets";
import { nip19 } from "@nostrband/nostr-tools";
import NDK, { NDKRelaySet } from "@nostrband/ndk";
import { config } from "../config";
import { browser } from "../browser";
import { getNpub } from "../utils/helpers/general";

const nostrbandRelay = "wss://relay.nostr.band/";
const nostrbandRelayCounts = "wss://relay.nostr.band/all";

const KIND_META = 0;
const KIND_APP = 31990;

const readRelays = [
  nostrbandRelay,
  'wss://nos.lol',
  'wss://relay.damus.io',
];
const writeRelays = [...readRelays, 'wss://nostr.mutinywallet.com']; // for broadcasting

const defaultApps = [
  {
    naddr: "naddr1qqxnzd3cx5urqvf3xserqdenqgsgrz3ekhckgg6lscj5kyk2tph0enqljh5ck3wtrjguw8w9m9yxmksrqsqqql8kvwe43l",
    name: "Nostr Apps",
    picture: "https://nostrapp.link/logo.png",
    url: "https://nostrapp.link/",
    about: "Find new Nostr apps, publish apps, switch between apps.",
    kinds: [0, 30117, 31990],
    handlers: {
      0: { url: "https://nosta.me/p/<bech32>" },
      30117: { url: "https://nosta.me/r/<bech32>" },
      31990: { url: "https://nosta.me/a/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqqnqq3qsx9rnd03vs34lp39fvfv5krwlnxpl90f3dzuk8y3cuwutk2gdhdqxpqqqp70vh7mzgu",
    name: "Nostr",
    picture: nostrIcon,
    url: "https://nostr.band/",
    about: "Search and discovery on Nostr",
    kinds: [0, 1, 30023],
    handlers: {
      0: { url: "https://nostr.band/<bech32>" },
      1: { url: "https://nostr.band/<bech32>" },
      30023: { url: "https://nostr.band/<bech32>" }
    }
  },
  {
    naddr: "naddr1qq9kzurs94c8ymmxd9kx2q3qsn0rtcjcf543gj4wsg7fa59s700d5ztys5ctj0g69g2x6802npjqxpqqqp70veq8u55",
    name: "Snort",
    picture: snortIcon,
    url: "https://snort.social/",
    about: "Feature packed nostr web client",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://snort.social/p/<bech32>" },
      1: { url: "https://snort.social/e/<bech32>", type: "nevent" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cx5mnyvec8qungvenqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8ks78ejl",
    name: "Iris",
    picture: irisIcon,
    url: "https://iris.to/",
    about: "Iris app ⚡️ The Nostr client for better social networks",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://iris.to/<bech32>" },
      1: { url: "https://iris.to/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cx5unvwps8yenvwfsqgsf03c2gsmx5ef4c9zmxvlew04gdh7u94afnknp33qvv3c94kvwxgsrqsqqql8kylym66",
    name: "Coracle",
    picture: coracleIcon,
    url: "https://coracle.social/",
    about: "An experimental Nostr client focused on unlocking the full potential of multiple relays. Browse, filter, zap, and create custom feeds to create a curated Nostr experience.",
    kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985],
    handlers: {
      0: { url: "https://coracle.social/<bech32>" },
      1: { url: "https://coracle.social/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cx5unxdehx56rgwfkqgs07f7srjc72ma4skqrqmrm5a4mqdalyyw9k4eu2mjwwr9gtp644uqrqsqqql8kj9hy6d",
    name: "Satellite",
    picture: satelliteIcon,
    url: "https://satellite.earth/",
    about: "Satellite is a nostr web client with a reddit-like interface optimized for conversation threads. Includes a media-hosting service with the ability to upload files up to 5GB.",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://satellite.earth/@<bech32>" },
      1: { url: "https://satellite.earth/thread/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cxccrvdfhxg6nyd3nqgs8fzl6slzr0v55zex30p9nyjsd962ftjpx3cqyfc78094rk9vvnkqrqsqqql8krf899y",
    name: "Zapddit",
    picture: "https://zapddit.com/assets/icons/logo-without-text-zapddit.svg",
    url: "https://zapddit.com/",
    about: "Hey there👋 I am zapddit, a reddit-style #nostr client with a fresh outlook on #nostr - Follow topics, not just people.",
    kinds: [1],
    handlers: {
      1: { url: "https://zapddit.com/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cxc6n2d33xymrvwpeqgsp9z7qt2n06ssaqrpuxwyn98eeelr4pvp4mdkd45htp7vrhl6k98crqsqqql8kc4575h",
    name: "Nosta",
    picture: "https://nosta.me/images/apple-icon-120x120.png",
    url: "https://nosta.me/",
    about: "The antidote to Nostr profile anxiety. Nosta onboards your onto the Nostr ecosystem in a few simple steps, helps you manage your profile info as you go, gives you a nice profile page with all your recent activity, and helps you find fun and interesting things to do on Nostr. Your profile is central to everything you do on Nostr, Nosta helps you set it up in the way you want it.",
    kinds: [0],
    handlers: {
      0: { url: "https://nosta.me/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cx5urydfcxqunzd3nqgsru22d9lfnnwck54qr4phrvey50h2q33xc0gqxv5j03ftn4efu4rsrqsqqql8kr7wmdc",
    name: "Pinstr",
    picture: "https://pinstr.app/favicon.ico",
    url: "https://pinstr.app/",
    about: "Pinstr is a decentralized and open-source social network for curating and sharing your interests with the world. With Pinstr, you can easily organize and discover new ideas, inspiration, and recommendations.",
    kinds: [0],
    handlers: {
      0: { url: "https://pinstr.app/p/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cxuenywfk8ycnqvenqgs86nsy2qatyes4m40jnmqgk5558jl979a6escp9vnzyr92yv4tznqrqsqqql8kdg24gq",
    name: "Habla",
    picture: "",
    url: "https://habla.news/",
    about: "Habla allows you to read, write, curate and monetize long form content over Nostr.",
    kinds: [0, 30023],
    handlers: {
      0: { url: "https://habla.news/p/<bech32>", type: "nprofile" },
      30023: { url: "https://habla.news/a/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cx5urqdpcxcmrxv34qgs0c934tdk4mmyy7pfunu6uf4fm3a2arre942gpxe096hparva47wqrqsqqql8kfg6jd0",
    name: "Listr",
    picture: "https://void.cat/d/5vVZpbmyeFfiNgZ4ayCGDy.webp",
    url: "https://listr.lol/",
    about: "The best way to create and manage Nostr lists.",
    kinds: [0, 30000, 30001],
    handlers: {
      0: { url: "https://listr.lol/<bech32>" },
      3: { url: "https://listr.lol/a/<bech32>" },
      30000: { url: "https://listr.lol/a/<bech32>" },
      30001: { url: "https://listr.lol/a/<bech32>" }
    },
  },
  {
    naddr: "naddr1qqxnzd3cx5urqv3exgmrsdenqgs8834mjfzq4y6yy70h5d428hshzry3nzc7n69rjnx38cxatjv5cccrqsqqql8ktxa4yy",
    name: "Highlighter",
    picture: "https://void.cat/d/8cvy6d6VHYx6F7MBQ8DJLn.webp",
    url: "https://highlighter.com/",
    about: "Information yearns to be free. And addressable. by @PABLOF7z",
    kinds: [0, 9802],
    handlers: {
      0: { url: "https://highlighter.com/p/<bech32>" },
      9802: { url: "https://highlighter.com/e/<bech32>" }
    },
  }
];

const DEFAULT_PUBKEY = "anon";

async function fetchTrendingProfiles() {
  const res = await fetch("https://api.nostr.band/v0/trending/profiles");
  const tpr = await res.json();

  const tp = tpr.profiles.map((p) => {
    try {
      const pr = JSON.parse(p.profile.content);
      pr.npub = getNpub(p.pubkey);
      pr.pubkey = p.pubkey;
      return pr;
    } catch (e) {
      console.log("failed to parse profile", e);
      return undefined;
    }
  });

  if (tp.length > 10) tp.length = 10;
  return tp;
}

function parseProfile(c) {
  try {
    return JSON.parse(c);
  } catch (e) {
    console.error("Bad profile json: ", c, e);
    return {};
  }
}

async function fetchApps(ndk) {

  // try to fetch best apps list from our relay
  const top = await ndk.fetchTop({
    kinds: [KIND_APP],
    limit: 50
  }, NDKRelaySet.fromRelayUrls([nostrbandRelay], ndk));

  let events = null;
  if (top.ids.length) {
    // fetch the app events themselves from the list
    events = await ndk.fetchEvents({
      ids: top.ids
    }, NDKRelaySet.fromRelayUrls(readRelays, ndk));
  } else {
    // load non-best apps from other relays just to avoid
    // completely breaking the UX due to our relay being down
    events = await ndk.fetchEvents({
      kinds:[KIND_APP],
      limit: 50
    }, NDKRelaySet.fromRelayUrls(readRelays, ndk));
  }
  events = [...events.values()];

  // load authors of the apps, we need them both for the app
  // info and for apps that inherit the author's profile info
  let profiles = await ndk.fetchEvents({
    authors: events.map(e => e.pubkey),
    kinds: [KIND_META]
  }, NDKRelaySet.fromRelayUrls(readRelays, ndk));
  profiles = [...profiles.values()];

  const getTag = (e, name) => {
    for (const t of e.tags) {
      if (t.length >= 1 && t[0] === name)
	return t.length > 1 ? t[1] : "";
    }
    return "";
  };

  const findHandlerUrl = (e, k) => {
    for (const t of e.tags) {
      if (t[0] !== "web" || t.length < 3)
	continue;

      if (k === KIND_META && (t[2] === "npub" || t[2] === "nprofile")) {
	return [t[1], t[2]];
      }

      if (k >= 30000 && k < 40000 && t[2] === "naddr") {
	return [t[1], t[2]];
      }

      return [t[1], t[2]];
    }

    return null;
  };

  // assign order to the apps, sort by top or by published date
  if (top)
    top.ids.forEach((id, i) => {const e = events.find(e => e.id == id); if (e) e.order = top.ids.length - i;});
  else
    events.forEach((e, i) => e.order = getTag(e, "published_at"));

  // sort events by order desc
  events.sort((a, b) => b.order - a.order);

  // convert to a convenient app object
  const apps = [];
  events.map(e => {

    // app author
    const author = profiles.find(p => p.pubkey == e.pubkey);

    // app profile - it's own, or inherited from the author
    const profile = e.content ? parseProfile(e.content) : parseProfile(author ? author.content : "");

    // app's handled kinds and per-kind handler urls for the 'web' platform,
    // we don't add a kind that doesn't have a proper handler
    const kinds = [];
    const handlers = {};
    e.tags.forEach(t => {
      let k = 0;
      if (t.length < 2 || t[0] != 'k')
	return;

      try {
	k = parseInt(t[1]);
      } catch(e) {
	return;
      }

      const url_type = findHandlerUrl(e, k);
      if (!url_type)
	return;

      kinds.push(k);
      handlers[k] = {
	url: url_type[0],
	type: url_type[1],
      };
    });

    const app = {
      naddr: nip19.naddrEncode({pubkey: e.pubkey, kind: e.kind, identifier: getTag(e, "d")}),
      name: profile ? profile.display_name || profile.name : "<Noname app>",
      url: (profile && profile.website) || "",
      picture: profile && profile.picture || "",
      about: profile && profile.about || "",
      author,
      kinds,
      handlers
    };

    apps.push(app);
  });

  return apps;
}

const API = {
  setUrl: async function (tab, url) {
    if (tab) {
      console.log("tab", tab.id, "setUrl", url);
      tab.url = url;
      await updateTab(tab);
    }
  },
  decodeBech32: function (tab, s) {
    return nip19.decode(s);
  },
};

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  const [keys, setKeys] = useState();
  const [currentPubkey, setCurrentPubkey] = useState();

  const [ndk, setNdk] = useState(null);
  const [apps, setApps] = useState(defaultApps);

  const [pins, setPins] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState(null);
  const [lastTab, setLastTab] = useState(null);
  const [prevTab, setPrevTab] = useState(null);

  const [pinApp, setPinApp] = useState(null);
  const [trendingProfiles, setTrendingProfiles] = useState();

  // FIXME move to a separate page
  const [openKey, setOpenKey] = useState();

  const loadKeys = async () => {
    const list = await keystore.listKeys();

    if (list.currentAlias) {
      setCurrentPubkey(list.currentAlias);
      const keys = Object.keys(list).filter((key) => key !== "currentAlias");
      if (keys.length) {
        setKeys(keys);
      }
    }

    return list.currentAlias;
  };

  const loadWorkspace = async (workspaceKey) => {
    // const dbTabs = await listTabs(workspaceKey)
    const dbPins = await listPins(workspaceKey);

    // setTabs(dbTabs)
    setPins(dbPins);
  };

  const bootstrap = async (pubkey) => {
    console.log("new workspace, bootstrapping");
    let pins = [];
    defaultApps.forEach((app, ind) => {
      const pin = {
        id: "" + Math.random(),
        url: app.url,
        appNaddr: app.naddr,
        title: app.name,
        icon: app.picture,
        order: ind,
        pubkey: pubkey,
      };
      pins.push(pin);
    });
    await db.pins.bulkAdd(pins);
  };

  const ensureBootstrapped = async (workspaceKey) => {
    if (!(await getFlag(workspaceKey, "bootstrapped"))) {
      await bootstrap(workspaceKey);
      await setFlag(workspaceKey, "bootstrapped", true);
    }
  };

  useEffect(() => {
    async function onDeviceReady() {
      console.log("device ready");

      const currentKey = await loadKeys();
      const workspaceKey = currentKey || DEFAULT_PUBKEY;

      const ndk = new NDK({ explicitRelayUrls: writeRelays });
      setNdk(ndk);

      await ndk.connect();

      // need to get them first before bootstrapping
      await fetchApps(ndk).then(setApps);

      await ensureBootstrapped(workspaceKey);
      await loadWorkspace(workspaceKey);

      await fetchTrendingProfiles().then(setTrendingProfiles);
    }

    if (config.DEBUG) onDeviceReady();
    else document.addEventListener("deviceready", onDeviceReady, false);
  }, []);

  const addKey = async () => {
    await keystore.addKey();

    // reload the list
    const pubkey = await loadKeys();

    // reassign everything from default to the new key
    if (currentPubkey === DEFAULT_PUBKEY) {
      await db.tabs.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey });
      await db.pins.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey });
    }

    // make sure this key has default apps pinned
    await ensureBootstrapped(pubkey);

    // load new key's tabs etc
    await loadWorkspace(pubkey);
  };

  const createTab = async (tab) => {
    const params = {
      url: tab.url,
      hidden: true,
      API,
      apiCtx: tab,
      onLoadStop: async (event) => {
        tab.url = event.url;
        await updateTab(tab);
      },
      onGetPubkey: (pubkey) => {
        if (pubkey !== currentPubkey) {
          let npub = nip19.npubEncode(pubkey);
          console.log("npub", npub);
          setCurrentPubkey(pubkey);
          // FIXME bootstrap etc, just remove it and start onboarding?
        }
      },
      onClick: (x, y) => {
        console.log("click", x, y);
        //	tab.ref.hide();
        //	hide(tab);
        document.elementFromPoint(x, y).click();
      },
      onMenu: async () => {
        console.log("menu click tab", tab.id);
        //	browser.showMenu(tab.ref);
        //	return;

        // FIXME just for now a hack to close a tab
        // close & remove tab
        close(tab);
      },
      onBlank: (url) => {
        hide(tab);
        open(url);
      },
    };

    // open the browser
    tab.ref = await browser.open(params);
  };

  const close = async (tab) => {
    hide(tab);

    await deleteTab(tab.id);
    tab.ref.close();

    setTabs((prev) => prev.filter((t) => t.id !== tab.id));
  };

  const hide = (tab) => {
    if (tab) {
      tab.ref.hide();
      setLastTab(currentTab);
      setCurrentTab(null);
    }

    document.getElementById("pins").classList.remove("d-none");
    document.getElementById("pins").classList.add("d-flex");
    document.getElementById("tab-menu").classList.remove("d-flex");
    document.getElementById("tab-menu").classList.add("d-none");
  };

  const showTabMenu = () => {
    document.getElementById("pins").classList.remove("d-flex");
    document.getElementById("pins").classList.add("d-none");
    document.getElementById("tab-menu").classList.remove("d-none");
    document.getElementById("tab-menu").classList.add("d-flex");
  };

  const show = async (tab) => {
    showTabMenu();

    console.log("is working");

    return new Promise((ok) => {
      setTimeout(async () => {
        // schedule the open after task bar is changed
        if (!tab.ref) await createTab(tab);

        tab.ref.show();
        if (lastTab && lastTab.id != tab.id) setPrevTab(lastTab);
        setCurrentTab(tab);
        ok();
      }, 0);
    });
  };

  const openApp = async (url, app) => {
    return open(url, {
      appNaddr: app.naddr,
      title: app.name,
      icon: app.picture,
    });
  };

  const toggle = (tab) => {
    console.log("toggle", tab.id, currentTab);
    if (currentTab != null && tab.id === currentTab.id) {
      hide(tab);
    } else {
      show(tab);
    }
  };

  const open = async (url, pin) => {
    console.log("open", url);

    // make sure it's visible and has proper height
    showTabMenu();

    // check if an open tab for this app exists
    if (pin) {
      const tab = tabs.find((t) => t?.appNaddr === pin.appNaddr);
      if (tab) {
        show(tab);
        return;
      }
    }

    // schedule the open when tab menu is rendered
    setTimeout(async () => {
      const U = new URL(url);
      const title = U.hostname;

      const tab = {
        id: "" + Math.random(),
        pubkey: currentPubkey,
        title: pin ? pin.title : title,
        icon: pin ? pin.icon : U.origin + "/favicon.ico",
        url,
        order: tabs.length + 1,
        ref: null, // filled below
        pinned: pin && pin.id,
      };
      if (pin) tab.appNaddr = pin.appNaddr;
      console.log("open", url, JSON.stringify(pin), JSON.stringify(tab));

      await createTab(tab);

      await addTab(tab);

      await show(tab);

      if (lastTab && lastTab.id !== tab.id) setPrevTab(lastTab);
      setCurrentTab(tab);
      setTabs((prev) => [tab, ...tabs]);
    }, 0);
  };

  async function copyKey() {
    const text = getNpub(openKey);
    // eslint-disable-next-line
    cordova.plugins.clipboard.copy(text);
  }

  const showKey = async () => {
    await keystore.showKey({ publicKey: openKey });
  };

  const selectKey = async (ind) => {
    const key = keys[ind];
    const res = await keystore.selectKey({ publicKey: key });

    if (res && res.currentAlias !== currentPubkey) {
      const pubkey = await loadKeys();
      await loadWorkspace(pubkey);
    }
  };

  const editKey = async (keyInfoObj) => {
    const keysList = await keystore.editKey(keyInfoObj);

    if (keysList) {
      await loadWorkspace(currentPubkey);
    }
  };

  const closeTab = () => {
    console.log("closeTab");
    if (currentTab) close(currentTab);
  };

  const hideTab = () => {
    console.log("hideTab");
    if (currentTab) hide(currentTab);
  };

  const showTabs = () => {};

  const switchTabs = () => {
    hideTab();
    show(prevTab);
  };

  const togglePinTab = (openPinAppModal) => {
    if (!currentTab) return;

    if (currentTab.pinned) {
      // unpin
      const pin = pins.find((p) => p.appNaddr == currentTab.appNaddr);
      if (pin) {
        setPins((prev) => prev.filter((p) => p.id != pin.id));
        deletePin(pin.id);
        currentTab.pinned = false;
      }
    } else {
      const app = apps.find((a) => a.naddr == currentTab.appNaddr);
      console.log("pin app", app);
      setPinApp(app);
      openPinAppModal();
      currentTab.ref.hide();
    }
  };

  const savePin = (app, perms) => {
    const pin = {
      id: "" + Math.random(),
      url: currentTab.url,
      appNaddr: currentTab.appNaddr,
      title: currentTab.title,
      icon: currentTab.icon,
      order: pins.length,
      pubkey: currentPubkey,
      perms,
    };

    console.log("perms", JSON.stringify(perms));

    setPins((prev) => [...prev, pin]);
    addPin(pin);

    currentTab.pinned = true;

    currentTab.ref.show();
  };

  const pinTab = () => {
    // FIXME create pin and add
  };

  const npub = currentPubkey ? getNpub(currentPubkey) : "";

  return (
    <AppContext.Provider
      value={{
        npub,
        keys,
        open,
        onAddKey: addKey,
        onSelectKey: selectKey,
        trendingProfiles,
        apps,
        onOpenApp: openApp,
        tabs,
        onToggleTab: toggle,
        onCloseTab: closeTab,
        onHideTab: hideTab,
        onPinTab: pinTab,
        onShowTabs: showTabs,
        onSwitchTabs: switchTabs,
        pins,
        setOpenKey,
        onCopyKey: copyKey,
        onShowKey: showKey,
        onEditKey: editKey,
        keyProp: { publicKey: openKey },
        pinApp,
        onSavePin: savePin,
        onTogglePin: togglePinTab,
        currentTab,
        prevTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
