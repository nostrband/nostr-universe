import React, { useEffect, useState } from "react";
import { keystore } from "../keystore";
import { db, dbi } from "../db";
import { nip19 } from "@nostrband/nostr-tools";
import { config } from "../config";
import { connect, fetchApps, subscribeProfiles } from "../nostr";
import { browser } from "../browser";
import { getNpub } from "../utils/helpers/general";
import { getTrendingProfilesRequest } from "../api/profiles";
import { getTrendingNotesRequest } from "../api/notes";
import { DEFAULT_APPS, DEFAULT_PUBKEY } from "../utils/constants/general";

async function loadKeys() {
  const list = await keystore.listKeys();
  const keys = Object.keys(list).filter((key) => key !== "currentAlias");
  return [keys, list.currentAlias];
}

function createWorkspace(pubkey, props = {}) {
  return {
    pubkey,
    trendingProfiles: [],
    trendingNotes: [],
    tabGroups: {},
    tabs: [],
    pins: [],
    currentTabId: "",
    lastCurrentTabId: "",
    ...props,
  };
}

function getTabGroupId(pt) {
  return pt.appNaddr || new URL(pt.url).origin;
}

function addToTabGroup(workspace, pt, isPin) {
  const id = getTabGroupId(pt);
  if (!(id in workspace.tabGroups))
    workspace.tabGroups[id] = {
      id,
      info: pt,
      tabs: [],
    };

  const tg = workspace.tabGroups[id];
  if (isPin && !tg.pin) {
    tg.pin = pt;
  }

  if (!isPin) {
    tg.tabs.push(pt.id);
  }
}

function deleteFromTabGroup(workspace, pt, isPin) {
  const id = getTabGroupId(pt);
  if (!(id in workspace.tabGroups)) return;

  const tg = workspace.tabGroups[id];
  if (!isPin) tg.tabs = tg.tabs.filter((id) => id !== pt.id);
  else if (tg.pin?.id === pt.id) tg.pin = null;

  if (!tg.pin && !tg.tabs.length) delete workspace.tabGroups[id];
}

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  // keys & profiles
  const [keys, setKeys] = useState();
  const [currentPubkey, setCurrentPubkey] = useState();
  const [profile, setProfile] = useState({});
  const [profiles, setProfiles] = useState([]);

  // global list of top apps from the network
  const [apps, setApps] = useState(DEFAULT_APPS);

  // workspace
  const [workspaces, setWorkspaces] = useState([]);

  // modal states
  const [pinApp, setPinApp] = useState(null);
  const [openKey, setOpenKey] = useState();

  const [openEventAddr, setOpenEventAddr] = useState("");
  const [contextInput, setContextInput] = useState("");

  // helpers for initial loading w/ useEffect
  const reloadProfiles = async (keys, currentPubkey) => {
    setProfile(null); // FIXME loading
    setProfiles([]); // FIXME loading
    if (!keys || !keys.length) return;

    subscribeProfiles(keys, (profile) => {
      console.log("profile update", profile);
      if (profile.pubkey == currentPubkey) setProfile(profile);
      if (keys.find((k) => profile.pubkey))
        setProfiles((prev) => [
          profile,
          ...prev.filter((p) => p.pubkey != profile.pubkey),
        ]);
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
    workspace.pins.sort((a, b) => a.order - b.order);
    workspace.tabs.sort((a, b) => a.order - b.order);

    // reset just in case
    workspace.tabs.forEach((t) => (t.opened = false));

    workspace.pins.forEach((p) => addToTabGroup(workspace, p, true));
    workspace.tabs.forEach((t) => addToTabGroup(workspace, t));

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

      // fetch trending stuff, set to all workspaces
      await getTrendingProfilesRequest().then((profiles) => {
        setWorkspaces((prev) =>
          prev.map((w) => {
            return { ...w, trendingProfiles: profiles };
          })
        );
      });
      await getTrendingNotesRequest().then((notes) => {
        setWorkspaces((prev) =>
          prev.map((w) => ({ ...w, trendingNotes: notes }))
        );
      });

      connect().then((_) => {
        console.log("ndk connected", Date.now());

        fetchApps().then(setApps);
        reloadProfiles(keys, currentPubkey);
      });
    }

    if (config.DEBUG) onDeviceReady();
    else document.addEventListener("deviceready", onDeviceReady, false);
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

  const updateWorkspace = (cbProps, pubkey = currentPubkey) => {
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
        tab.url = url;
        await dbi.updateTab(tab);
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
    },
    onLoadStop: async (tabId, event) => {
      console.log("loaded", event.url);
      updateTab({ url: event.url, loading: false }, tabId);
      const tab = getTab(tabId);
      if (tab) await dbi.updateTab(tab);
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
      openBlank({ url });
    },
    onIcon: async (tabId, icon) => {
      updateTab({ icon }, tabId);
      const tab = getTab(tabId);
      if (tab) {
        tab.icon = icon;
        await dbi.updateTab(tab);
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
      const { trendingProfiles = [], trendingNotes = [] } =
        workspaces.find((w) => w.pubkey === currentPubkey) || {};

      // init new workspace
      addWorkspace(pubkey, { trendingProfiles, trendingNotes });
    }

    // make sure we have info on this new profile
    reloadProfiles(keys, pubkey);
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
    await hide(tab);

    await dbi.deleteTab(tab.id);
    await browser.close(tab.id);

    updateWorkspace((ws) => {
      deleteFromTabGroup(ws, tab);
      return {
        tabs: ws.tabs.filter((t) => t.id !== tab.id),
        tabGroups: { ...ws.tabGroups },
      };
    });
  };

  const hide = async (tab) => {
    if (tab) {
      await browser.hide(tab.id);
      updateWorkspace({ currentTabId: "" });
    }

    document.getElementById("pins").style.display = "block";
    document.getElementById("tab-menu").classList.remove("d-flex");
    document.getElementById("tab-menu").classList.add("d-none");
  };

  const showTabMenu = () => {
    document.getElementById("pins").style.display = "none";
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
        updateWorkspace({ currentTabId: tab.id });
        ok();
      }, 0);
    });
  };

  const openApp = async (params) => {
    const pin = currentWorkspace.pins.find((p) => p.appNaddr === params.naddr);

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

    // find an existing app for this url
    const origin = new URL(url).origin;
    const app = apps.find((a) => a.url.startsWith(origin));
    if (app) {
      const pin = currentWorkspace.pins.find((p) => p.appNaddr === app.naddr);
      await open({
        url,
        pinned: !!pin,
        icon: app.picture,
        title: app.title,
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

    const U = new URL(url);

    if (!title)
      title = U.hostname.startsWith("www.")
        ? U.hostname.substring(4)
        : U.hostname;

    if (!icon) icon = U.origin + "/favicon.ico";

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

  const selectKey = async (ind) => {
    const key = keys[ind];

    const res = await keystore.selectKey({ publicKey: key });

    if (res && res.currentAlias !== currentPubkey) {
      const [keys, pubkey] = await loadKeys();
      setCurrentPubkey(pubkey);
      setKeys(keys);

      reloadProfiles(keys, pubkey);
    }
  };

  const editKey = async (keyInfoObj) => {
    const keysList = await keystore.editKey(keyInfoObj);
    // update some key infos? idk

    reloadProfiles(keys, currentPubkey);
  };

  const openTabGroup = async (tg) => {
    if (tg.tabs.length)
      await show(getTab(tg.tabs[0])); // FIXME open current tab
    else await open({ ...tg.pin, pinned: true });
  };

  const closeTab = async () => {
    console.log("closeTab");
    if (currentTab) await close(currentTab);
    else if (lastCurrentTab) await close(lastCurrentTab);
  };

  const hideTab = async () => {
    console.log("hideTab");
    if (currentTab) await hide(currentTab);
  };

  const unpinTab = () => {
    const tab = lastCurrentTab;
    if (!tab || !tab.pinned) return;

    const pin = currentWorkspace.pins.find((p) => p.appNaddr === tab.appNaddr);
    if (pin) {
      updateWorkspace((ws) => {
        deleteFromTabGroup(ws, pin, true);
        return {
          pins: ws.pins.filter((p) => p.id !== pin.id),
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

    const app = apps.find((a) => a.naddr === tab.appNaddr);
    if (app) {
      setPinApp(app);
      openPinAppModal();
      await browser.hide(tab.id);
    } else {
      savePin([]);
    }
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

  const isGuest = () => {
    return currentPubkey === DEFAULT_PUBKEY;
  };

  return (
    <AppContext.Provider
      value={{
        currentPubkey,
        isGuest,
        keys,
        profile,
        profiles,
        apps,
        onAddKey: addKey,
        onSelectKey: selectKey,
        onOpenBlank: openBlank,
        onOpenApp: openApp,
        onOpenTab: show,
        onOpenTabGroup: openTabGroup,
        onCloseTab: closeTab,
        onHideTab: hideTab,
        setOpenKey,
        onCopyKey: copyKey,
        onShowKey: showKey,
        onEditKey: editKey,
        keyProp: { publicKey: openKey },
        pinApp,
        onSavePin: savePin,
        pinTab,
        unpinTab,
        onOpenEvent: setOpenEventAddr,
        workspaces,
        currentWorkspace,
        currentTab,
        currentTabGroup,
        lastCurrentTab,
        clearLastCurrentTab,
        onModalOpen,
        onModalClose,
        contextInput,
        setContextInput,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
