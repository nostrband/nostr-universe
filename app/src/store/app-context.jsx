import React, { useEffect, useState } from "react";
import { keystore } from "../keystore";
import { db, dbi } from "../db";
import {
  coracleIcon,
  irisIcon,
  nostrIcon,
  satelliteIcon,
  snortIcon,
} from "../assets";
import { nip19 } from "@nostrband/nostr-tools";
import { config } from "../config";
import {
  connect,
  fetchApps,
  subscribeProfiles,
  subscribeContactLists,
  fetchAppsForEvent,
  stringToBech32,
} from "../nostr";
import { browser } from "../browser";
import { allRelays } from "../nostr";
import { getNpub } from "../utils/helpers/general";

const defaultApps = [
  {
    naddr:
      "naddr1qqqnqq3qsx9rnd03vs34lp39fvfv5krwlnxpl90f3dzuk8y3cuwutk2gdhdqxpqqqp70vh7mzgu",
    name: "Nostr.Band",
    picture: nostrIcon,
    url: "https://nostr.band/",
    about: "Search and discovery on Nostr",
    kinds: [0, 1, 30023],
    handlers: {
      0: { url: "https://nostr.band/<bech32>" },
      1: { url: "https://nostr.band/<bech32>" },
      30023: { url: "https://nostr.band/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qq9kzurs94c8ymmxd9kx2q3qsn0rtcjcf543gj4wsg7fa59s700d5ztys5ctj0g69g2x6802npjqxpqqqp70veq8u55",
    name: "Snort",
    picture: snortIcon,
    url: "https://snort.social/",
    about: "Feature packed nostr web client",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://snort.social/p/<bech32>" },
      1: { url: "https://snort.social/e/<bech32>", type: "nevent" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5mnyvec8qungvenqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8ks78ejl",
    name: "Iris",
    picture: irisIcon,
    url: "https://iris.to/",
    about: "Iris app ⚡️ The Nostr client for better social networks",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://iris.to/<bech32>" },
      1: { url: "https://iris.to/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5unvwps8yenvwfsqgsf03c2gsmx5ef4c9zmxvlew04gdh7u94afnknp33qvv3c94kvwxgsrqsqqql8kylym66",
    name: "Coracle",
    picture: coracleIcon,
    url: "https://coracle.social/",
    about:
      "An experimental Nostr client focused on unlocking the full potential of multiple relays. Browse, filter, zap, and create custom feeds to create a curated Nostr experience.",
    kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985],
    handlers: {
      0: { url: "https://coracle.social/<bech32>" },
      1: { url: "https://coracle.social/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5unxdehx56rgwfkqgs07f7srjc72ma4skqrqmrm5a4mqdalyyw9k4eu2mjwwr9gtp644uqrqsqqql8kj9hy6d",
    name: "Satellite",
    picture: satelliteIcon,
    url: "https://satellite.earth/",
    about:
      "Satellite is a nostr web client with a reddit-like interface optimized for conversation threads. Includes a media-hosting service with the ability to upload files up to 5GB.",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://satellite.earth/@<bech32>" },
      1: { url: "https://satellite.earth/thread/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5urqvf3xserqdenqgsgrz3ekhckgg6lscj5kyk2tph0enqljh5ck3wtrjguw8w9m9yxmksrqsqqql8kvwe43l",
    name: "Nostr Apps",
    picture: "https://nostrapp.link/logo.png",
    url: "https://nostrapp.link/",
    about: "Find new Nostr apps, publish apps, switch between apps.",
    kinds: [0, 30117, 31990],
    handlers: {
      0: { url: "https://nosta.me/p/<bech32>" },
      30117: { url: "https://nosta.me/r/<bech32>" },
      31990: { url: "https://nosta.me/a/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cxccrvdfhxg6nyd3nqgs8fzl6slzr0v55zex30p9nyjsd962ftjpx3cqyfc78094rk9vvnkqrqsqqql8krf899y",
    name: "Zapddit",
    picture: "https://zapddit.com/assets/icons/logo-without-text-zapddit.svg",
    url: "https://zapddit.com/",
    about:
      "Hey there👋 I am zapddit, a reddit-style #nostr client with a fresh outlook on #nostr - Follow topics, not just people.",
    kinds: [1],
    handlers: {
      1: { url: "https://zapddit.com/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cxc6n2d33xymrvwpeqgsp9z7qt2n06ssaqrpuxwyn98eeelr4pvp4mdkd45htp7vrhl6k98crqsqqql8kc4575h",
    name: "Nosta",
    picture: "https://nosta.me/images/apple-icon-120x120.png",
    url: "https://nosta.me/",
    about:
      "The antidote to Nostr profile anxiety. Nosta onboards your onto the Nostr ecosystem in a few simple steps, helps you manage your profile info as you go, gives you a nice profile page with all your recent activity, and helps you find fun and interesting things to do on Nostr. Your profile is central to everything you do on Nostr, Nosta helps you set it up in the way you want it.",
    kinds: [0],
    handlers: {
      0: { url: "https://nosta.me/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5urydfcxqunzd3nqgsru22d9lfnnwck54qr4phrvey50h2q33xc0gqxv5j03ftn4efu4rsrqsqqql8kr7wmdc",
    name: "Pinstr",
    picture: "https://pinstr.app/favicon.ico",
    url: "https://pinstr.app/",
    about:
      "Pinstr is a decentralized and open-source social network for curating and sharing your interests with the world. With Pinstr, you can easily organize and discover new ideas, inspiration, and recommendations.",
    kinds: [0],
    handlers: {
      0: { url: "https://pinstr.app/p/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cxuenywfk8ycnqvenqgs86nsy2qatyes4m40jnmqgk5558jl979a6escp9vnzyr92yv4tznqrqsqqql8kdg24gq",
    name: "Habla",
    picture: "",
    url: "https://habla.news/",
    about:
      "Habla allows you to read, write, curate and monetize long form content over Nostr.",
    kinds: [0, 30023],
    handlers: {
      0: { url: "https://habla.news/p/<bech32>", type: "nprofile" },
      30023: { url: "https://habla.news/a/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5urqdpcxcmrxv34qgs0c934tdk4mmyy7pfunu6uf4fm3a2arre942gpxe096hparva47wqrqsqqql8kfg6jd0",
    name: "Listr",
    picture: "https://void.cat/d/5vVZpbmyeFfiNgZ4ayCGDy.webp",
    url: "https://listr.lol/",
    about: "The best way to create and manage Nostr lists.",
    kinds: [0, 30000, 30001],
    handlers: {
      0: { url: "https://listr.lol/<bech32>" },
      3: { url: "https://listr.lol/a/<bech32>" },
      30000: { url: "https://listr.lol/a/<bech32>" },
      30001: { url: "https://listr.lol/a/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5urqv3exgmrsdenqgs8834mjfzq4y6yy70h5d428hshzry3nzc7n69rjnx38cxatjv5cccrqsqqql8ktxa4yy",
    name: "Highlighter",
    picture: "https://void.cat/d/8cvy6d6VHYx6F7MBQ8DJLn.webp",
    url: "https://highlighter.com/",
    about: "Information yearns to be free. And addressable. by @PABLOF7z",
    kinds: [0, 9802],
    handlers: {
      0: { url: "https://highlighter.com/p/<bech32>" },
      9802: { url: "https://highlighter.com/e/<bech32>" },
    },
  },
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
  console.log("tp", tp);

  if (tp.length > 10) tp.length = 10;
  return tp;
}

async function loadKeys() {
  const list = await keystore.listKeys();
  const keys = Object.keys(list).filter((key) => key !== "currentAlias");
  return [keys, list.currentAlias];
}

function createWorkspace(pubkey, props = {}) {
  return {
    pubkey,
    trendingProfiles: [],
    tabGroups: {},
    tabs: [],
    pins: [],
    lastKindApps: {},
    currentTabId: "",
    lastCurrentTabId: "",
    ...props,
  };
}

function getOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

function getTabGroupId(pt) {
  return pt.appNaddr || getOrigin(pt.url);
}

function addToTabGroup(workspace, pt, isPin) {
  const id = getTabGroupId(pt);
  if (!(id in workspace.tabGroups))
    workspace.tabGroups[id] = {
      id,
      info: pt,
      tabs: [],
      lastTabId: "",
    };

  const tg = workspace.tabGroups[id];
  if (isPin && !tg.pin) {
    tg.pin = pt;
  }

  if (!isPin) {
    tg.tabs.push(pt.id);
  }
};

function deleteFromTabGroup(workspace, pt, isPin) {
  const id = getTabGroupId(pt);
  if (!(id in workspace.tabGroups))
    return;

  const tg = workspace.tabGroups[id];
  if (!isPin)
    tg.tabs = tg.tabs.filter(id => id !== pt.id);
  else if (tg.pin?.id === pt.id)
    tg.pin = null;

  if (!tg.pin && !tg.tabs.length)
    delete workspace.tabGroups[id];
}

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  // keys & profiles
  const [keys, setKeys] = useState();
  const [currentPubkey, setCurrentPubkey] = useState();
  const [profile, setProfile] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [contactList, setContactList] = useState({});

  // global list of top apps from the network
  const [apps, setApps] = useState(defaultApps);

  // workspace
  const [workspaces, setWorkspaces] = useState([]);

  // modal states
  const [pinApp, setPinApp] = useState(null);
  const [openKey, setOpenKey] = useState();

  const [openAddr, setOpenAddr] = useState("");
  const [contextInput, setContextInput] = useState("");

  // helpers for initial loading w/ useEffect
  const reloadProfiles = async (keys, currentPubkey, profiles) => {
    console.log("reloadProfiles", keys, currentPubkey);
    if (profiles && profile.pubkey !== currentPubkey) {
      const p = profiles.find(p => p.pubkey === currentPubkey);
      setProfile(p || {});
      setContactList({});
    }
    if (!keys || !keys.length) return;

    subscribeProfiles(keys, (profile) => {
      if (profile.pubkey == currentPubkey) setProfile(profile);
      if (keys.find((k) => profile.pubkey)) {
        setProfiles((prev) => [
          profile,
          ...prev.filter((p) => p.pubkey != profile.pubkey),
        ]);

	dbi.putProfile(profile);
      }
    });

    subscribeContactLists(keys, (cl) => {
      if (cl.pubkey == currentPubkey
	  && (!contactList.pubkey || contactList.created_at < cl.created_at)) {
	console.log("contact list update", cl);
	setContactList(cl);
      }
    });
  };

  const bootstrap = async (pubkey) => {
    console.log("new workspace", pubkey, " bootstrapping");
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
    if (!(await dbi.getFlag(workspaceKey, "bootstrapped"))) {
      await bootstrap(workspaceKey);
      await dbi.setFlag(workspaceKey, "bootstrapped", true);
    }
  };

  const loadWorkspace = async (workspace) => {
    console.log("workspaceKey", workspace.pubkey);
    workspace.pins = await dbi.listPins(workspace.pubkey);
    workspace.tabs = await dbi.listTabs(workspace.pubkey);
    workspace.pins.sort((a, b) => a.order - b.order);
    workspace.tabs.sort((a, b) => a.order - b.order);

    // reset just in case
    workspace.tabs.forEach(t => t.opened = false);

    workspace.pins.forEach(p => addToTabGroup(workspace, p, true));
    workspace.tabs.forEach(t => addToTabGroup(workspace, t));

    console.log(
      "load pins",
      workspace.pins.length,
      "tabs",
      workspace.tabs.length,
      "tabGroups",
      Object.keys(workspace.tabGroups).length
    );
  };

  const addWorkspace = async (pubkey, props) => {
    await ensureBootstrapped(pubkey);
    const workspace = createWorkspace(pubkey, props);
    await loadWorkspace(workspace);
    setWorkspaces((prev) => [...prev, workspace]);
  };

  useEffect(() => {
    async function onDeviceReady() {
      console.log("device ready", Date.now());

      const [keys, currentPubkey] = await loadKeys();
      setCurrentPubkey(currentPubkey);
      setKeys(keys);

      // add existing workspaces from db
      for (const pubkey of keys) addWorkspace(pubkey);

      // init default one if db is empty
      if (!currentPubkey) {
        addWorkspace(DEFAULT_PUBKEY);
        setCurrentPubkey(DEFAULT_PUBKEY);
      }

      // fetch cached stuff
      const apps = await dbi.listApps();
      if (apps.length > 0) setApps(apps);
      const profiles = await dbi.listProfiles();
      if (profiles.length > 0) {
	setProfiles(profiles);
	const p = profiles.find(p => p.pubkey === currentPubkey);
	setProfile(p || {});
      }
      
      // fetch trending stuff, set to all workspaces
      await fetchTrendingProfiles().then((profiles) => {
        setWorkspaces((prev) =>
          prev.map((w) => {
            return { ...w, trendingProfiles: profiles };
          })
        );
      });

      connect().then(async () => {
        console.log("ndk connected", Date.now());

	// update apps first
        const apps = await fetchApps();
	if (apps.length) {
	  setApps(apps);
	  await db.apps.bulkPut(apps);
	}

	// start profile updater after we're done with apps,
	// this should be the last of the initial loading
	// operations
        reloadProfiles(keys, currentPubkey, profiles);
      });
    }

    if (config.DEBUG) onDeviceReady();
    else document.addEventListener("deviceready", onDeviceReady, false);
  }, []);

  const currentWorkspace = workspaces.find((w) => w.pubkey === currentPubkey);
  const currentTab = currentWorkspace?.tabs.find((t) => t.id === currentWorkspace.currentTabId);
  const currentTabGroup = currentTab ? currentWorkspace?.tabGroups[getTabGroupId(currentTab)] : undefined;
  const lastCurrentTab = currentWorkspace?.tabs.find((t) => t.id === currentWorkspace.lastCurrentTabId);
  const getTab = (id) => currentWorkspace?.tabs.find((t) => t.id === id);

  const updateWorkspace = (cbProps, pubkey) => {
    pubkey = pubkey || currentPubkey;
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.pubkey === pubkey
          ? { ...w, ...(typeof cbProps === "function" ? cbProps(w) : cbProps) }
          : w
      )
    );
  };

  const updateTab = (cbProps, tabId) => {
    tabId = tabId || currentTab?.id;
    updateWorkspace((ws) => {
      return {
        tabs: ws.tabs.map((t) =>
          t.id === tabId
            ? {
                ...t,
                ...(typeof cbProps === "function" ? cbProps(t) : cbProps),
              }
            : t
        ),
      };
    });
  };

  const API = {
    setUrl: async function (tabId, url) {
      console.log("tab", tabId, "setUrl", url);
      updateTab({ url }, tabId);

      const tab = getTab(tabId);
      if (tab) {
	// save old tab to reuse in state update
	const wasTab = {...tab};

	// set new url
	tab.url = url;

	// need to switch tab group?
	const tgid = getTabGroupId(tab);
	if (tgid !== getTabGroupId(wasTab)) {
	  updateWorkspace((ws) => {
	    console.log("tab", wasTab.id, "delete from", wasTab.url);
	    deleteFromTabGroup(ws, wasTab);
	    
	    wasTab.url = url;
	    addToTabGroup(ws, wasTab);

	    const tg = ws.tabGroups[tgid];
	    tg.lastTabId = wasTab.id;

	    return { tabGroups: {...ws.tabGroups} }
	  }, tab.pubkey);
	}

	dbi.updateTab(tab);
      }
    },
    showContextMenu: async function (tabId, id) {
      console.log("event menu", id);
      setContextInput(id);
    },
    decodeBech32: function (tabId, s) {
      return nip19.decode(s);
    },
    onLoadStart: async (tabId, event) => {
      console.log("loading", JSON.stringify(event));
      API.setUrl(tabId, event.url);
    },
    onLoadStop: async (tabId, event) => {
      console.log("loaded", event.url);
      API.setUrl(tabId, event.url);
      updateTab({ loading: false }, tabId);
    },
    onGetPubkey: (tabId, pubkey) => {
      if (pubkey !== currentPubkey) {
        setCurrentPubkey(pubkey);
        // FIXME bootstrap etc, just remove it and start onboarding?
      }
    },
    onClick: (tabId, x, y) => {
      console.log("click", x, y);
      let e = document.elementFromPoint(x, y);
      // SVG doesn't have 'click'
      while (e && !e.click) e = e.parentNode;
      console.log("click on ", e);
      if (e) e.click();
    },
    onBlank: async (tabId, url) => {
      const tab = getTab(tabId);
      if (tab) await hide(tab);
      if (url.startsWith("nostr:")) {
	const b32 = stringToBech32(url);
	if (b32) {
	  // offer to choose an app to show the event
	  setOpenAddr(b32);
	} else {
	  // try some external app that might know this type of nostr: link
	  window.cordova.InAppBrowser.open(url, '_self');
	}
      } else {
	openBlank({url});
      }
    },
    onBeforeLoad: async (tabId, url) => {
      await API.onBlank(tabId, url);
    },
    onHide: (tabId) => {
      console.log("hide", tabId);
      hide(getTab(tabId));
    },
    onIcon: async (tabId, icon) => {
      updateTab({ icon }, tabId);
      const tab = getTab(tabId);
      if (tab) {
	tab.icon = icon;
	dbi.updateTab(tab);
      }
    },
  };

  // update on every rerender to capture new callbacks
  browser.setAPI(API);

  const addKey = async () => {
    await keystore.addKey();

    // reload the list
    const [keys, pubkey] = await loadKeys();
    setCurrentPubkey(pubkey);
    setKeys(keys);

    // our first key?
    if (currentPubkey === DEFAULT_PUBKEY) {
      // reassign everything from default to the new key
      await db.tabs.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey });
      await db.pins.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey });

      updateWorkspace({ pubkey }, DEFAULT_PUBKEY);
    } else {
      // copy trending stuffbottom
      const tp = workspaces.find(
        (w) => w.pubkey == currentPubkey
      ).trendingProfiles;

      // init new workspace
      addWorkspace(pubkey, { trendingProfiles: tp });
    }

    // make sure we have info on this new profile
    reloadProfiles(keys, pubkey, profiles);
  };

  const createTabBrowser = async (tab) => {
    updateTab({ loading: true }, tab.id);
    updateWorkspace({ currentTabId: tab.id });

    const params = {
      id: tab.id,
      url: tab.url,
      hidden: true,
      apiCtx: tab.id,
    };

    updateTab({ opened: true }, tab.id);

    // open the browser
    await browser.open(params);
  };

  const ensureBrowser = async (tab) => {
    if (!tab.opened) await createTabBrowser(tab);
  };

  const close = async (tab) => {
    await dbi.deleteTab(tab.id);
    await browser.close(tab.id);

    updateWorkspace((ws) => {
      deleteFromTabGroup(ws, tab);
      return {
        tabs: ws.tabs.filter((t) => t.id !== tab.id),
	tabGroups: {...ws.tabGroups}
      };
    });
  };

  const stop = async (tab) => {
    if (tab) {
      updateTab({ loading: false }, tab.id);
      await browser.stop(tab.id);
    }
  }

  const reload = async (tab) => {
    if (tab) {
      updateTab({ loading: true }, tab.id);
      await browser.reload(tab.id);
    }
  }

  const hide = async (tab) => {
    if (tab) {
      updateWorkspace({ currentTabId: "" });
      await browser.hide(tab.id);
    }

    document.getElementById("pins").style.display = "block";
    // document.getElementById("pins").classList.add("d-flex");
    document.getElementById("tab-menu").classList.remove("d-flex");
    document.getElementById("tab-menu").classList.add("d-none");
  };

  const showTabMenu = () => {
    document.getElementById("pins").style.display = "none";
    // document.getElementById("pins").classList.add("d-none");
    document.getElementById("tab-menu").classList.remove("d-none");
    document.getElementById("tab-menu").classList.add("d-flex");
  };

  const show = async (tab) => {
    showTabMenu();

    return new Promise((ok) => {
      setTimeout(async () => {
        // schedule the open after task bar is changed
	console.log("show", JSON.stringify(tab));
        await ensureBrowser(tab);

        await browser.show(tab.id);
        updateWorkspace((ws) => {
	  const tg = ws.tabGroups[getTabGroupId(tab)];
	  tg.lastTabId = tab.id;
	  return { currentTabId: tab.id, tabGroups: {...ws.tabGroups} }
	});
        ok();
      }, 0);
    });
  };

  const openApp = async (params) => {

    if (params.kind !== undefined) {
      updateWorkspace((ws) => {
	ws.lastKindApps[params.kind] = params.naddr;
	return {
	  lastKindApps: {...ws.lastKindApps}
	}
      });
    }
    
    const pin = currentWorkspace.pins.find((p) => p.appNaddr == params.naddr);
    
    await openBlank({
      url: params.url,
      pinned: !!pin,
      appNaddr: params.naddr,
      title: params.name,
      icon: params.picture,
    });
  };

  const openBlank = async (params) => {
    const { url } = params;
    console.log("openBlank", JSON.stringify(params));

    // find an existing tab w/ same url
    const tab = currentWorkspace.tabs.find(t => t.url === url);
    if (tab) {
      await show(tab);
      return;
    }

    // find an existing app for this url
    const origin = getOrigin(url);
    const app = params.appNaddr
	      ? apps.find(a => a.naddr === params.appNaddr)
	      : apps.find(a => a.url.startsWith(origin));
    if (app) {
      const pin = currentWorkspace.pins.find(p => p.appNaddr === app.naddr);
      await open({
	url,
	pinned: !!pin,
	icon: app.picture,
	title: app.name,
	appNaddr: app.naddr
      });
      return;
    }

    // nothing's known about this url, open a new tab
    await open(params);
  };
  
  const open = async (params) => {
    console.log("open", JSON.stringify(params));

    let {url, title = "", icon = "", pinned = false} = params;

    try {
      const U = new URL(url);
      if (!title)
	title = U.hostname.startsWith("www.") ? U.hostname.substring(4) : U.hostname;
      if (!icon)
	icon = U.origin + "/favicon.ico"
    } catch {
      if (!title)
	title = url;
    }

    const tab = {
      url,
      id: "" + Math.random(),
      pubkey: currentPubkey,
      title: title,
      icon: icon,
      appNaddr: params.appNaddr,
      order: currentWorkspace.tabs.length,
      pinned,
    };
    console.log("open", url, JSON.stringify(params), JSON.stringify(tab));

    // add to tab list
    updateWorkspace((ws) => {
      addToTabGroup(ws, tab);
      return {
        tabs: [...ws.tabs, tab],
        lastCurrentTabId: "", // make sure previous active tab doesn't reopen on modal close
	tabGroups: {...ws.tabGroups},
      };
    });

    // add to db
    await dbi.addTab(tab);

    // it creates the tab and sets as current
    await show(tab);
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
      const [keys, pubkey] = await loadKeys();
      setCurrentPubkey(pubkey);
      setKeys(keys);

      reloadProfiles(keys, pubkey, profiles);
    }
  };

  const editKey = async (keyInfoObj) => {
    const keysList = await keystore.editKey(keyInfoObj);
    // update some key infos? idk

    reloadProfiles(keys, currentPubkey, profiles);
  };

  const openTabGroup = async (tg) => {
    if (tg.tabs.length) {
      const tab = getTab(tg.lastTabId || tg.tabs[0]);
      await show(tab);
    } else {
      await open({...tg.pin, pinned: true});
    }
  };

  const closeTab = async () => {
    console.log("closeTab");
    const tab = currentTab || lastCurrentTab;
    if (!tab)
      return;
    
    // hide first
    await hide(tab);

    // get tab group of the closed tab
    const tg = currentWorkspace.tabGroups[getTabGroupId(tab)];
    
    // switch to previous one of the group
    const index = tg.tabs.findIndex(id => id === tab.id);
    const next = index ? index - 1 : index + 1;
    console.log("next", next);
    if (next < tg.tabs.length)
      await show(getTab(tg.tabs[next]));
    
    // close in bg after that
    await close(tab);
  };

  const hideTab = async () => {
    console.log("hideTab");
    if (currentTab) await hide(currentTab);
  };

  const stopTab = async () => {
    console.log("stopTab");
    if (currentTab) await stop(currentTab);
  };

  const reloadTab = async () => {
    console.log("reloadTab");
    if (currentTab) await reload(currentTab);
  };

  const unpinTab = () => {
    const tab = lastCurrentTab;
    if (!tab || !tab.pinned) return;
      
    const pin = currentWorkspace.pins.find((p) => p.appNaddr == tab.appNaddr);
    if (pin) {
      updateWorkspace((ws) => {
	deleteFromTabGroup(ws, pin, true);
	return {
          pins: ws.pins.filter((p) => p.id != pin.id),
	  tabGroups: {...ws.tabGroups}
	}
      });
      updateTab({ pinned: false }, tab.id);
      dbi.deletePin(pin.id);
    }
  };

  const pinTab = async (openPinAppModal) => {
    const tab = lastCurrentTab;
    if (!tab || tab.pinned) return;

    savePin([]);

//    const app = apps.find((a) => a.naddr == tab.appNaddr);
//    if (app) {
//      setPinApp(app);
//      openPinAppModal();
//      await browser.hide(tab.id);
//    } else {
//      savePin([]);
//    }
  };

  const savePin = (perms) => {
    const tab = lastCurrentTab;
    if (!tab) return;

    const pin = {
      id: "" + Math.random(),
      url: tab.url,
      appNaddr: tab.appNaddr,
      title: tab.title,
      icon: tab.icon,
      order: currentWorkspace.pins.length,
      pubkey: currentPubkey,
      perms,
    };

    console.log("perms", JSON.stringify(perms));

    updateWorkspace((ws) => {
      addToTabGroup(ws, pin, true);
      return {
        pins: [...ws.pins, pin],
	tabGroups: {...ws.tabGroups},
      };
    });
    updateTab({ pinned: true }, tab.id);

    dbi.addPin(pin);
  };

  const onModalOpen = async () => {
    console.log("onModalOpen", currentTab);
    if (!currentTab) return;

    await hide(currentTab);

    updateWorkspace({ lastCurrentTabId: currentTab.id });
  };

  const onModalClose = async () => {
    const lastCurrentTabId = currentWorkspace.lastCurrentTabId;
    console.log("onModalClose", lastCurrentTabId);
    if (!lastCurrentTabId) return;

    const lastCurrentTab = currentWorkspace.tabs.find(
      (t) => t.id === lastCurrentTabId
    );
    if (!lastCurrentTab) return;
    
    await show(lastCurrentTab);

    updateWorkspace({ lastCurrentTabId: "" });
  };

  const clearLastCurrentTab = () => {
    updateWorkspace({ lastCurrentTabId: "" });
  };
  
  const isGuest = () => {
    return currentPubkey == DEFAULT_PUBKEY;
  };

  return (
    <AppContext.Provider
      value={{
        currentPubkey,
        isGuest,
        keys,
        profile,
        profiles,
        contactList,
        apps,
        onAddKey: addKey,
        onSelectKey: selectKey,
	onOpenBlank: openBlank,
        onOpenApp: openApp,
        onOpenTab: show,
        onOpenTabGroup: openTabGroup,
        onCloseTab: closeTab,
        onHideTab: hideTab,
        onStopTab: stopTab,
        onReloadTab: reloadTab,
        setOpenKey,
        onCopyKey: copyKey,
        onShowKey: showKey,
        onEditKey: editKey,
        keyProp: { publicKey: openKey },
        pinApp,
        onSavePin: savePin,
	pinTab,
	unpinTab,
        workspaces,
        currentWorkspace,
        currentTab,
        currentTabGroup,
	getTab,
        lastCurrentTab,
	clearLastCurrentTab,
        onModalOpen,
        onModalClose,
        contextInput,
        setContextInput,
	openAddr,
	setOpenAddr
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
