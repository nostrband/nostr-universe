/* eslint-disable */
// @ts-nocheck
import { browser } from '@/modules/browser'
import { dbi } from '@/modules/db'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setCloseTabWindow, setCurrentTab, setLoadingTab, setOpenTab } from '@/store/reducers/tab.slice'
import { setCurrentWorkspace, setTabsWorkspace, setWorkspaces } from '@/store/reducers/workspaces.slice'
import { AppNostro, IOpenAppNostro } from '@/types/app-nostro'
import { getKeys, writeCurrentPubkey } from '@/utils/keys'
import { v4 as uuidv4 } from 'uuid'
import { useUpdateProfile } from './profile'
import { setCurrentPubKey, setKeys } from '@/store/reducers/keys.slice'
import { addWorkspace } from '@/modules/AppInitialisation/utils'

function getOrigin(url) {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

export const useOpenApp = () => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const { apps } = useAppSelector((state) => state.apps)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const { currentTab, openedTabs } = useAppSelector((state) => state.tab)

  const getTab = (id) => currentWorkSpace?.tabs.find((t) => t.id === id)

  const hide = async (tab) => {
    await browser.hide(tab.id)
  }

  const onHideTabInBrowser = async () => {
    await hide(currentTab)
  }

  const onHideTab = async () => {
    await hide(currentTab)

    dispatch(
      setCloseTabWindow({
        isOpenTabWindow: false
      })
    )
  }

  const onSwitchTab = async (tab) => {
    await openBlank(tab)
  }

  const onStopLoadTab = async () => {
    dispatch(
      setLoadingTab({
        isLoading: false
      })
    )

    await browser.stop(currentTab.id)
  }

  const onReloadTab = async () => {
    console.log('onReloadTab')
    dispatch(
      setLoadingTab({
        isLoading: true
      })
    )

    await browser.reload(currentTab.id).finally(() => {
      dispatch(
        setLoadingTab({
          isLoading: false
        })
      )
    })
  }

  const API = {
    onHide: (tabId) => {
      hide(getTab(tabId))
    },
    onClick: (tabId, x, y) => {
      console.log('click', x, y)
      let e = document.elementFromPoint(x, y)
      // SVG doesn't have 'click'
      while (e && !e.click) e = e.parentNode
      console.log('click on ', e)
      if (e) e.click()
    }
  }

  browser.setAPI(API)

  const createTabBrowser = async (tab) => {
    const openTab = {
      id: tab.id,
      name: tab.title,
      url: tab.url,
      picture: tab.icon,
      appNaddr: tab.appNaddr
    }

    dispatch(setOpenTab({ tab: openTab }))

    dispatch(
      setCurrentTab({
        currentTab: openTab
      })
    )

    const dataTabForOpen = {
      id: tab.id,
      url: tab.url,
      hidden: true,
      apiCtx: tab.id
    }

    await browser.open(dataTabForOpen)

    dispatch(
      setLoadingTab({
        isLoading: false
      })
    )

    return
  }

  const show = async (tab) => {
    return new Promise((ok) => {
      setTimeout(async () => {
        const getOpenedTab = openedTabs.find((openedTab) => tab.id === openedTab.id)

        if (!getOpenedTab) {
          await createTabBrowser(tab)
        }

        await browser.show(tab.id)

        dispatch(
          setCurrentTab({
            currentTab: { id: tab.id, name: tab.title, url: tab.url, picture: tab.icon, appNaddr: tab.appNaddr }
          })
        )

        ok()
      }, 0)
    })
  }

  const open = async (params) => {
    console.log('open', JSON.stringify(params))

    let { url, title = '', icon = '', pinned = false } = params

    try {
      const U = new URL(url)
      if (!title) title = U.hostname.startsWith('www.') ? U.hostname.substring(4) : U.hostname
      if (!icon) icon = U.origin + '/favicon.ico'
    } catch {
      if (!title) title = url
    }

    const tab = {
      url,
      id: uuidv4(),
      pubkey: currentPubKey,
      title: title,
      icon: icon,
      appNaddr: params.appNaddr,
      order: currentWorkSpace.tabs.length,
      pinned
    }
    // console.log("open", url, JSON.stringify(params), JSON.stringify(tab));

    // // add to tab list
    dispatch(setTabsWorkspace({ tab }))

    dispatch(
      setCurrentTab({
        currentTab: { id: tab.id, name: tab.title, url: tab.url, picture: tab.icon, appNaddr: tab.appNaddr }
      })
    )

    // // add to db

    await dbi.addTab(tab)

    // it creates the tab and sets as current
    await show(tab)
  }

  const openBlank = async (entity: AppNostro) => {
    const tab = currentWorkSpace.tabs.find((tab) => tab.url === entity.url)

    if (tab) {
      await show(tab)
      return
    }

    // // find an existing app for this url
    const origin = getOrigin(entity.url)
    const app = entity.appNaddr
      ? apps.find((app) => app.naddr === entity.appNaddr)
      : apps.find((app) => app.url.startsWith(origin))

    if (app) {
      await open({
        url: entity.url,
        pinned: entity.pinned,
        icon: app.picture,
        title: app.name,
        appNaddr: app.naddr
      })

      return
    }

    // nothing's known about this url, open a new tab
    // await open(params);
  }

  const openApp = async (app: IOpenAppNostro) => {
    // if (params.kind !== undefined) {
    //   updateWorkspace((ws) => {
    //     ws.lastKindApps[params.kind] = params.naddr;
    //     return {
    //       lastKindApps: { ...ws.lastKindApps },
    //     };
    //   });
    // }
    const pin = currentWorkSpace.pins.find((pin) => pin.appNaddr == app.naddr)

    await openBlank({
      url: app.url,
      pinned: !!pin,
      appNaddr: app.naddr,
      title: app.name,
      icon: app.picture
    })
  }

  const onImportKey = async (importPubkey) => {
    if (importPubkey) {
      await dbi.putReadOnlyKey(importPubkey)
      await writeCurrentPubkey(importPubkey)
    } else {
      const r = await keystore.addKey()
      await writeCurrentPubkey(r.pubkey)
    }

    // // reload the list
    const [keys, pubkey] = await getKeys()
    dispatch(setKeys({ keys }))
    dispatch(setCurrentPubKey({ currentPubKey: pubkey }))

    const workspace = await addWorkspace(pubkey)

    dispatch(setWorkspaces({ workspaces: [workspace] }))

    dispatch(setCurrentWorkspace({ currentPubKey: pubkey }))

    await updateProfile(keys, pubkey)
  }

  return {
    openApp,
    onStopLoadTab,
    onReloadTab,
    onHideTab,
    onSwitchTab,
    onHideTabInBrowser,
    onImportKey
  }
}
