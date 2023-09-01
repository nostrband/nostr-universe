import React, { useEffect, useState } from "react";
import { keystore } from "../keystore";
import { db, dbi } from "../db";
import { nip19 } from "@nostrband/nostr-tools";
import { config } from "../config";
import {
  connect,
  fetchApps,
  subscribeProfiles,
  subscribeContactList,
  fetchFollowedLongNotes,
  fetchFollowedLiveEvents,
  fetchFollowedCommunities,
  fetchFollowedZaps,
  fetchFollowedHighlights,
  stringToBech32,
} from "../nostr";
import { browser } from "../browser";
import { parseAddr } from "../nostr";
import { getNpub } from "../utils/helpers/general";
import { getTrendingProfilesRequest } from "../api/profiles";
import { getTrendingNotesRequest } from "../api/notes";
import { getSuggestedProfilesRequest } from "../api/suggested-profiles";
import { DEFAULT_APPS, DEFAULT_PUBKEY } from "../utils/constants/general";

const MIN_ZAP_AMOUNT = 1000;

async function writeCurrentPubkey(pubkey) {
  await dbi.setFlag("", "currentPubkey", pubkey);
}

function createWorkspace(pubkey, props = {}) {
  return {
    pubkey,
    trendingProfiles: [],
    trendingNotes: [],
    highlights: [],
    longNotes: [],
    liveEvents: [],
    bigZaps: [],
    communities: [],
    suggestedProfiles: [],
    tabGroups: {},
    tabs: [],
    pins: [],
    perms: [],
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
      order: pt.order,
      lastActive: 0,
    };
  
  const tg = workspace.tabGroups[id];
  if (isPin && !tg.pin) {
    tg.pin = pt;
  }

  // FIXME info and pin aren't updated if their objects are modified elsewhere,
  // in particular a change in tab icon won't propagate to the tab group bcs
  // we're copying a tab, but not re-assigning it to the tab group
  
  if (!isPin) {
    tg.tabs.push(pt.id);
  }

  if (tg.lastActive < pt.lastActive)
    tg.lastActive = pt.lastActive;
}

function deleteFromTabGroup(workspace, pt, isPin) {
  const id = getTabGroupId(pt);
  if (!(id in workspace.tabGroups)) return;

  const tg = workspace.tabGroups[id];
  if (!isPin) tg.tabs = tg.tabs.filter((id) => id !== pt.id);
  else if (tg.pin?.id === pt.id) tg.pin = null;

  if (tg.lastTabId === pt.id) tg.lastTabId = "";
  
  if (!tg.pin && !tg.tabs.length) delete workspace.tabGroups[id];
}

const AppContext = React.createContext();

const PermRequests = [];

const AppContextProvider = ({ children }) => {
  // keys
  const [keys, setKeys] = useState();
  const [readKeys, setReadKeys] = useState();
  const [currentPubkey, setCurrentPubkey] = useState();

  // profiles
  const [profile, setProfile] = useState({});
  const [profiles, setProfiles] = useState([]);

  // current contact list
  const [contactList, setContactList] = useState({});

  // global list of top apps from the network
  const [apps, setApps] = useState(DEFAULT_APPS);

  // workspace
  const [workspaces, setWorkspaces] = useState([]);

  // modal states
  const [pinApp, setPinApp] = useState(null);
  const [openKey, setOpenKey] = useState();

  const [openAddr, setOpenAddr] = useState("");
  const [contextInput, setContextInput] = useState("");

  const [currentPermRequest, setCurrentPermRequest] = useState(null);

  const [isShowDrawer, setIsShowDrawer] = useState(true);

  const setContacts = async (cl) => {
    if (cl.contactEvents) {
      const lastContacts = await dbi.listLastContacts(cl.pubkey);
      console.log("lastContacts", lastContacts);
      lastContacts.forEach((lc) => {
        const c = cl.contactEvents.find((ce) => ce.pubkey === lc.contactPubkey);
        if (c) {
          c.order = lc.tm;
          console.log("lastContact", lc.contactPubkey, "tm", lc.tm);
        }
      });

      cl.contactEvents.sort((a, b) => b.order - a.order);
    }

    setContactList(cl);
  };

  // loads the per-profile data
  const reloadProfile = async (keys, pubkey) => {
    if (!keys || !keys.length) return;

    console.log("reloadProfile", keys, pubkey);

    // reuse cached profile info?
    if (pubkey !== currentPubkey) {
      const p = profiles?.find((p) => p.pubkey === pubkey);
      setProfile(p || {});
      setContacts({});
    }

    // suggested profiles
    if (pubkey !== DEFAULT_PUBKEY) {
      getSuggestedProfilesRequest(pubkey).then((suggestedProfiles) => {
        updateWorkspace((ws) => {
          return { ...ws, suggestedProfiles };
        }, pubkey);
      });
    }

    // subscribe to new keys
    subscribeProfiles(keys, (profile) => {
      if (!profile) {
        // FIXME no stored events for the remaining non-filled profiles
        return;
      }

      if (profile.pubkey == pubkey) setProfile(profile);
      if (keys.find((k) => profile.pubkey)) {
        setProfiles((prev) => [
          profile,
          ...prev.filter((p) => p.pubkey != profile.pubkey),
        ]);

        dbi.putProfile(profile);
      }
    });

    // subscribe to new contact list
    subscribeContactList(pubkey, async (cl) => {
      console.log("contact list update", cl?.created_at);

      setContacts(cl);

      // FIXME note we should be able to cancel this chain of loadings
      // if contactList changes. How?

      const highlights = await fetchFollowedHighlights(cl.contactPubkeys);
      console.log("new highlights", highlights);
      updateWorkspace((ws) => {
        return { ...ws, highlights };
      }, pubkey);

      const bigZaps = await fetchFollowedZaps(
        cl.contactPubkeys,
        MIN_ZAP_AMOUNT
      );
      console.log("new zaps", bigZaps);
      updateWorkspace((ws) => {
        return { ...ws, bigZaps };
      }, pubkey);

      const longNotes = await fetchFollowedLongNotes(cl.contactPubkeys);
      console.log("new long notes", longNotes);
      updateWorkspace((ws) => {
        return { ...ws, longNotes };
      }, pubkey);

      const liveEvents = await fetchFollowedLiveEvents(cl.contactPubkeys);
      console.log("new live events", liveEvents);
      updateWorkspace((ws) => {
        return { ...ws, liveEvents };
      }, pubkey);

      const communities = await fetchFollowedCommunities(cl.contactPubkeys);
      console.log("new communities", communities);
      updateWorkspace((ws) => {
        return { ...ws, communities };
      }, pubkey);
    });
  };

  const bootstrap = async (pubkey) => {
    console.log("new workspace", pubkey, " bootstrapping");
    let pins = [];
    DEFAULT_APPS.forEach((app, ind) => {
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
    workspace.perms = await dbi.listPerms(workspace.pubkey);
    console.log("perms", JSON.stringify(workspace.perms));

    // sort properly
    workspace.pins.sort((a, b) => a.order - b.order);
    workspace.tabs.sort((a, b) => a.order - b.order);

    // reset just in case
    workspace.tabs.forEach((t) => (t.opened = false));

    workspace.pins.forEach((p) => addToTabGroup(workspace, p, true));
    workspace.tabs.forEach((t) => addToTabGroup(workspace, t));

    if (config.DEBUG) {
      workspace.perms.push({
        pubkey: workspace.pubkey,
        app: "https://twitter.com",
        name: "pubkey",
        value: "1",
      });
      workspace.perms.push({
        pubkey: workspace.pubkey,
        app: "naddr1qqqnqq3qsx9rnd03vs34lp39fvfv5krwlnxpl90f3dzuk8y3cuwutk2gdhdqxpqqqp70vh7mzgu",
        name: "pubkey",
        value: "1",
      });
      workspace.perms.push({
        pubkey: workspace.pubkey,
        app: "naddr1qqqnqq3qsx9rnd03vs34lp39fvfv5krwlnxpl90f3dzuk8y3cuwutk2gdhdqxpqqqp70vh7mzgu",
        name: "sign-1",
        value: "1",
      });
    }
    
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

  const updateWorkspace = (cbProps, pubkey = currentPubkey) => {
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.pubkey === pubkey
          ? { ...w, ...(typeof cbProps === "function" ? cbProps(w) : cbProps) }
          : w
      )
    );
  };

  const reloadKeys = async () => {
    // can be writeKey or readKey
    let currentPubkey = await dbi.getFlag("", "currentPubkey");
    console.log("currentPubkey", currentPubkey);

    // write-keys from native plugin
    const list = await keystore.listKeys();
    console.log("listKeys", list);

    // ensure
    if (list.currentAlias && !currentPubkey) {
      await writeCurrentPubkey(list.currentAlias);
      currentPubkey = list.currentAlias;
    }

    const writeKeys = Object.keys(list).filter((key) => key !== "currentAlias");
    const readKeys = (await dbi.listReadOnlyKeys()).filter(
      (k) => !writeKeys.includes(k)
    );

    const keys = [...new Set([...writeKeys, ...readKeys])];
    console.log(
      "load keys cur",
      currentPubkey,
      "writeKeys",
      writeKeys,
      "readKeys",
      readKeys
    );

    setCurrentPubkey(currentPubkey);
    setKeys(keys);
    setReadKeys(readKeys);

    return [keys, currentPubkey, readKeys];
  };

  useEffect(() => {
    async function onDeviceReady() {
      console.log("device ready", Date.now());

      const [keys, currentPubkey] = await reloadKeys();

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
        const p = profiles.find((p) => p.pubkey === currentPubkey);
        setProfile(p || {});
      }

      // fetch trending stuff, can do it in parallel
      getTrendingProfilesRequest().then((profiles) => {
        setWorkspaces((prev) =>
          prev.map((w) => {
            return { ...w, trendingProfiles: profiles };
          })
        );
      });
      getTrendingNotesRequest().then((notes) => {
        setWorkspaces((prev) =>
          prev.map((w) => ({ ...w, trendingNotes: notes }))
        );
      });

      connect().then(async () => {
        console.log("ndk connected", Date.now());

        // start profile updater after we're done with apps,
        // this should be the last of the initial loading
        // operations
        reloadProfile(keys, currentPubkey);

        // update apps after we've subscribed to other stuff
        const apps = await fetchApps();
        if (apps.length) {
          setApps(apps);
          await db.apps.bulkPut(apps);
        }
      });
    }

    if (config.DEBUG) {
      onDeviceReady();
    } else {
      document.addEventListener("deviceready", onDeviceReady, false);
      document.addEventListener("backbutton", (e) => {
        console.log("back pressed", e);
        if (
          !window.history ||
          JSON.stringify(window.history.state) === "null"
        ) {
          e.preventDefault();
          navigator.app.exitApp();
        } else {
          window.history.back();
        }
      });
    }
  }, []);

  const currentWorkspace = workspaces.find((w) => w.pubkey === currentPubkey);

  const currentTab = currentWorkspace?.tabs.find(
    (t) => t.id === currentWorkspace.currentTabId
  );
  const currentTabGroup = currentTab
    ? currentWorkspace?.tabGroups[getTabGroupId(currentTab)]
    : undefined;
  const lastCurrentTab = currentWorkspace?.tabs.find(
    (t) => t.id === currentWorkspace.lastCurrentTabId
  );
  const getTab = (id) => currentWorkspace?.tabs.find((t) => t.id === id);
  const getTabAny = (id) =>
    workspaces
      ?.map((ws) => ws.tabs.find((t) => t.id === id))
      .find((t) => t !== undefined);
  const isReadOnly = () =>
    currentPubkey === DEFAULT_PUBKEY || readKeys.includes(currentPubkey);
  const hasPerm = (tab, name, value) => {
    const app = getTabGroupId(tab);
    return (
      workspaces
        .find((ws) => ws.pubkey === tab.pubkey)
        ?.perms.find((p) => p.app === app && p.name === name)?.value === value
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

  const requestPerm = (tab, req, cb) => {
    const r = {
      ...req,
      id: "" + Math.random(),
      tabId: tab.id,
      cb,
    };
    PermRequests.push(r);

    if (currentTab?.id === tab.id && PermRequests.length === 1) {
      // show request perm modal right now
      setCurrentPermRequest(r);
    }
  };

  const requestPermExec = (tab, perm, exec, error) => {
    return new Promise((ok, err) => {
      requestPerm(tab, perm, async (allowed) => {
	try {
          if (allowed) ok(await exec());
          else err(error);
	} catch (e) {
	  err(e)
	};
      });
    });
  };

  const handleCustomUrl = async (url, tab) => {
    if (url.startsWith("lightning:")) {
      // just open some outside app for now
      window.cordova.InAppBrowser.open(url, "_self");
      return true;
    }

    if (url.startsWith("nostr:")) {
      const b32 = stringToBech32(url);
      if (b32) {

	// hide it
	if (tab) await hide(tab);
	
        // offer to choose an app to show the event
        setOpenAddr(b32);
      } else {
        // try some external app that might know this type of nostr: link
        window.cordova.InAppBrowser.open(url, "_self");
      }

      return true;
    }

    return false;
  };
    
  const API = {
    // NIP-01
    getPublicKey: async function (tabId) {
      const tab = getTabAny(tabId);
      if (!tab) throw new Error("Inactive tab");
      if (currentPubkey === DEFAULT_PUBKEY) throw new Error("No pubkey");
      if (hasPerm(tab, "pubkey", "0"))
        throw new Error("Pubkey perm disallowed");
      if (hasPerm(tab, "pubkey", "1")) return currentPubkey;
      const exec = () => currentPubkey;
      return requestPermExec(tab, { perm: "pubkey" }, exec, "Pubkey perm disallowed");
    },
    signEvent: async function (tabId, event) {
      const tab = getTabAny(tabId);
      if (!tab) throw new Error("Inactive tab");
      if (isReadOnly()) throw new Error("No pubkey");
      const kindPerm = "sign:" + event.kind;
      const allPerm = "sign";
      const exec = async () => await window.nostr.signEvent(event);
      // allowed this kind or all kinds (if not kind-0)?
      if (
        hasPerm(tab, kindPerm, "1") ||
        (event.kind != 0 && hasPerm(tab, allPerm, "1"))
      )
        return await exec();
      // disallowed this kind or all kinds
      if (hasPerm(tab, kindPerm, "0") || hasPerm(tab, allPerm, "0"))
        throw new Error("Sign kind " + event.kind + " perm disallowed");
      return requestPermExec(tab, { perm: kindPerm, event },
			     exec, "Sign kind " + event.kind + " disallowed");
    },

    // NIP-04
    encrypt: async function (tabId, pubkey, plainText) {
      const tab = getTabAny(tabId);
      if (!tab) throw new Error("Inactive tab");
      if (isReadOnly()) throw new Error("No pubkey");
      if (hasPerm(tab, "encrypt", "0"))
        throw new Error("Encrypt perm disallowed");
      const exec = async () =>
        await window.nostr.nip04.encrypt(pubkey, plainText);
      if (hasPerm(tab, "encrypt", "1")) return await exec();
      return requestPermExec(tab, { perm: "encrypt", pubkey, plainText },
			     exec, "Encrypt disallowed");
    },
    decrypt: async function (tabId, pubkey, cipherText) {
      const tab = getTabAny(tabId);
      if (!tab) throw new Error("Inactive tab");
      if (isReadOnly()) throw new Error("No pubkey");
      if (hasPerm(tab, "decrypt", "0"))
        throw new Error("Decrypt perm disallowed");
      const exec = async () =>
        await window.nostr.nip04.decrypt(pubkey, cipherText);
      if (hasPerm(tab, "decrypt", "1")) return await exec();
      return requestPermExec(tab, { perm: "decrypt", pubkey, cipherText }, exec, "Decrypt disallowed");
    },

    setUrl: async function (tabId, url) {
      console.log("tab", tabId, "setUrl", url);
      updateTab({ url }, tabId);

      const tab = getTabAny(tabId);
      if (tab) {
        // save old tab to reuse in state update
        const wasTab = { ...tab };

        // set new url
        tab.url = url;

	// NOTE: if we don't do this, an url change that causes
	// group-id change will make this tab not-belong to the tab group
	// that still thinks it owns this tab...
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

            return { tabGroups: { ...ws.tabGroups } };
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
      updateTab({ loading: true }, tabId);
    },
    onLoadStop: async (tabId, event) => {
      console.log("loaded", event.url);
      API.setUrl(tabId, event.url);
      updateTab({ loading: false }, tabId);
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
      const tab = getTabAny(tabId);
      console.log("onBlank", tabId, tab?.url, url);

      // some special scheme?
      if (await handleCustomUrl(url, tab))
	return;

      // new tab coming, hide current one
      if (tab) await hide(tab);
      
      // just open another tab
      openBlank({ url });
    },
    onBeforeLoad: async (tabId, url) => {
      const tab = getTabAny(tabId);
      console.log("onBeforeLoad", tabId, tab?.url, url);
      // intercept lightning: and nostr: links
      return await handleCustomUrl(url, tab);
    },
    onHide: (tabId) => {
      console.log("hide", tabId);
      hide(getTab(tabId));
    },
    onIcon: async (tabId, icon) => {
      updateTab({ icon }, tabId);
      const tab = getTabAny(tabId);
      if (tab) {
        tab.icon = icon;
        dbi.updateTab(tab);
      }
    },
  };

  // update on every rerender to capture new callbacks
  browser.setAPI(API);

  const importPubkey = async (pubkey) => {
    console.log("importPubkey", pubkey);
    await addImportKey(pubkey);
  };

  const addKey = async () => {
    return addImportKey();
  };

  const addImportKey = async (importPubkey) => {
    if (importPubkey) {
      await dbi.putReadOnlyKey(importPubkey);
      await writeCurrentPubkey(importPubkey);
    } else {
      const r = await keystore.addKey();
      await writeCurrentPubkey(r.pubkey);
    }

    // reload the list
    const [keys, pubkey, readKeys] = await reloadKeys();

    // our first key?
    if (currentPubkey === DEFAULT_PUBKEY) {
      // reassign everything from default to the new key
      await db.tabs.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey });
      await db.pins.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey });
      updateWorkspace({ pubkey }, DEFAULT_PUBKEY);
    } else {
      // copy trending stuff
      const { trendingProfiles = [], trendingNotes = [] } =
        workspaces.find((w) => w.pubkey === currentPubkey) || {};

      // init new workspace
      addWorkspace(pubkey, { trendingProfiles, trendingNotes });
    }

    // make sure we have info on this new profile
    reloadProfile(keys, pubkey);
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
        tabGroups: { ...ws.tabGroups },
	// make sure that if we're closing in bg that we no longer refer to it 
	lastCurrentTabId: ws.lastCurrentTabId === tab.id ? "" : ws.lastCurrentTabId,
      };
    });
  };

  const stop = async (tab) => {
    if (tab) {
      updateTab({ loading: false }, tab.id);
      await browser.stop(tab.id);
    }
  };

  const reload = async (tab) => {
    if (tab) {
      updateTab({ loading: true }, tab.id);
      await browser.reload(tab.id);
    }
  };

  const hide = async (tab, noScreenshot = false) => {
    if (tab) {
      updateWorkspace({ currentTabId: "" });
      await browser.hide(tab.id);
    }
    setIsShowDrawer(true);
    document.getElementById("tab-menu").classList.remove("d-flex");
    document.getElementById("tab-menu").classList.add("d-none");
    document.body.style.overflow = "initial";

    if (tab && !noScreenshot) {
      // launch the 'screenshotting' after the next render cycle
      setTimeout(async () => {
        const screenshot = await browser.screenshot(tab.id);
        updateTab({ screenshot }, tab.id);

        tab.screenshot = screenshot;
        await dbi.updateTabScreenshot(tab);
      }, 0);
    }
  };

  const showTabMenu = () => {
    setIsShowDrawer(false);
    document.getElementById("tab-menu").classList.remove("d-none");
    document.getElementById("tab-menu").classList.add("d-flex");
    document.body.style.overflow = "hidden";
  };

  const show = async (tab) => {
    showTabMenu();

    return new Promise((ok) => {
      setTimeout(async () => {
        // schedule the open after task bar is changed
        console.log("show", JSON.stringify(tab));

	// mark as active
        tab.lastActive = Date.now();

	// set as current
        updateWorkspace((ws) => {
          const tg = ws.tabGroups[getTabGroupId(tab)];
          tg.lastTabId = tab.id;
          tg.lastActive = tab.lastActive;
          return { currentTabId: tab.id, tabGroups: { ...ws.tabGroups } };
        });
        updateTab({ lastActive: tab.lastActive }, tab.id);

	// make sure webview exists
        await ensureBrowser(tab);

	// show it
        await browser.show(tab.id);

	// write to db in the background, if that's possible
        dbi.updateTab(tab);

	// notify caller that we're done
        ok();

	// check if there are pending perm requests
        const reqs = PermRequests.filter((pr) => pr.tabId === tab.id);
        if (reqs.length > 0) {
          console.log(
            "shown tab " + tab.id + " has perm requests",
            JSON.stringify(reqs)
          );
          setCurrentPermRequest(reqs[0]);
        }
      }, 0);
    });
  };

  const swapTabs = (fromTabGroupId, toTabGroupId) => {
    updateWorkspace((ws) => {
      const fromTabGroup = ws.tabGroups[fromTabGroupId];
      const toTabGroup = ws.tabGroups[toTabGroupId];

      const fromOrder = fromTabGroup.order;
      const toOrder = toTabGroup.order;

      // swap the order of tab groups themselves
      const setOrder = (tg, order) => {
	tg.order = order;
	tg.info.order = order;
	if (tg.pin)
	  tg.pin.order = order;
      };

      setOrder(fromTabGroup, toOrder);
      setOrder(toTabGroup, fromOrder);

      const updateTabsPins = (tabsPins, pins) => {

	return tabsPins.map((tabPin) => {
	  let newTabPin = null;
	  const tgId = getTabGroupId(tabPin);
          if (tgId === fromTabGroupId) {
	    console.log("order for fromTabPin", tabPin.id, toOrder);
	    newTabPin = { ...tabPin, order: toOrder };
          }
          if (tgId === toTabGroupId) {
	    console.log("order for toTabPin", tabPin.id, fromOrder);
	    newTabPin = { ...tabPin, order: fromOrder };
          }

	  if (newTabPin != null) {
	    if (pins)
              dbi.updatePin(newTabPin);
	    else
              dbi.updateTab(newTabPin);
            return newTabPin;
	  }
          return tabPin;
	});

      };

      const swappedTabs = updateTabsPins(ws.tabs, false);
      const swappedPins = updateTabsPins(ws.pins, true);

      //      swappedTabs.forEach((t) => {
      //        console.log("TAB", t);
      //        const isPin = "pin" in t;
      //        addToTabGroup(ws, t, isPin);
      //      });

      const swappedTabGroups = { ...ws.tabGroups };
      swappedTabGroups[fromTabGroup.id] = {...fromTabGroup};
      swappedTabGroups[toTabGroup.id] = {...toTabGroup};

      return { tabs: swappedTabs, pins: swappedPins, tabGroups: swappedTabGroups };
    });
  };

  const openApp = async (params) => {
    if (params.kind !== undefined) {
      updateWorkspace((ws) => {
        ws.lastKindApps[params.kind] = params.naddr;
        return {
          lastKindApps: { ...ws.lastKindApps },
        };
      });
    }

    const pin = currentWorkspace.pins.find((p) => p.appNaddr == params.naddr);

    console.log("openApp", JSON.stringify(params));
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
    const tab = currentWorkspace.tabs.find((t) => t.url === url);
    if (tab) {
      await show(tab);
      return;
    }

    // we've decided to open another native app
    if (url.startsWith("nostr:")) {
      // try some external app that might know this type of nostr: link
      window.cordova.InAppBrowser.open(url, "_self");
      return;
    }
    
    // find an existing app for this url
    const origin = getOrigin(url);
    const app = params.appNaddr
	      ? apps.find((a) => a.naddr === params.appNaddr)
	      : apps.find((a) => a.url.startsWith(origin));
    if (app) {
      const pin = currentWorkspace.pins.find((p) => p.appNaddr === app.naddr);
      await open({
        url,
        pinned: !!pin,
        icon: app.picture,
        title: app.name,
        appNaddr: app.naddr,
      });
      return;
    }

    // nothing's known about this url, open a new tab
    await open(params);
  };

  const open = async (params) => {
    console.log("open", JSON.stringify(params));

    let { url, title = "", icon = "", pinned = false } = params;

    try {
      const U = new URL(url);
      if (!title)
        title = U.hostname.startsWith("www.")
          ? U.hostname.substring(4)
          : U.hostname;
      if (!icon) icon = U.origin + "/favicon.ico";
    } catch {
      if (!title) title = url;
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
        tabGroups: { ...ws.tabGroups },
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

  const selectKey = async (selectPubkey) => {
    console.log("selectKey res", selectPubkey);

    let pubkey = "";
    if (readKeys.includes(selectPubkey)) {
      // read?
      pubkey = selectPubkey;
    } else if (keys.includes(selectPubkey)) {
      // write?
      const res = await keystore.selectKey({ publicKey: selectPubkey });
      pubkey = res?.currentAlias;
    }

    if (!pubkey) throw new Error("Unknown pubkey");

    await writeCurrentPubkey(pubkey);

    // actual switch?
    if (pubkey !== currentPubkey) {
      const [keys, pubkey] = await reloadKeys();
      reloadProfile(keys, pubkey);
    }
  };

  const openTabGroup = async (tg) => {
    if (tg.tabs.length) {
      const tab = getTab(tg.lastTabId || tg.tabs[0]);
      await show(tab);
    } else {
      await open({ ...tg.pin, pinned: true });
    }
  };

  const closeTab = async () => {
    console.log("closeTab");
    const tab = currentTab || lastCurrentTab;
    if (!tab) return;

    // hide first
    await hide(tab, /* no_screenshot */ true);

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
          tabGroups: { ...ws.tabGroups },
        };
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
        tabGroups: { ...ws.tabGroups },
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

  const updateLastContact = async (b32) => {
    const addr = parseAddr(b32);
    if (addr.kind === 0 && addr.pubkey) {
      await dbi.updateLastContact(currentPubkey, addr.pubkey);
      setContacts({ ...contactList });
    }
  };

  const replyCurrentPermRequest = async (allow, remember) => {
    const tab = getTab(currentPermRequest.tabId);

    if (remember) {
      const perm = {
        pubkey: tab.pubkey,
        app: getTabGroupId(tab),
        name: currentPermRequest.perm,
        value: allow ? "1" : "0",
      };
      updateWorkspace((ws) => {
        return { perms: [...ws.perms, perm] };
      });
      await dbi.updatePerm(perm);
    }

    // execute
    await currentPermRequest.cb(allow);

    // drop executed request
    const i = PermRequests.findIndex((pr) => pr.id === currentPermRequest.id);
    if (i >= 0) PermRequests.splice(i, 1);
    else throw new Error("Perm request not found");

    // more reqs?
    const reqs = PermRequests.filter(
      (pr) => pr.tabId === currentPermRequest.tabId
    );
    if (reqs.length > 0) setCurrentPermRequest(reqs[0]);
    else setCurrentPermRequest(null);
  };

  const deletePerms = async (app) => {
    if (app)
      updateWorkspace((ws) => {
        return { perms: ws.perms.filter((p) => p.app != app) };
      });
    else
      updateWorkspace((ws) => {
        return { perms: [] };
      });

    await dbi.deletePerms(currentPubkey, app);
  };

  return (
    <AppContext.Provider
      value={{
        currentPubkey,
        keys,
        readKeys,
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
        onImportPubkey: importPubkey,
        setOpenKey,
        onCopyKey: copyKey,
        onShowKey: showKey,
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
        isShowDrawer,
        openAddr,
        setOpenAddr,
        updateLastContact,
        swapTabs,
        currentPermRequest,
        replyCurrentPermRequest,
        deletePerms,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
