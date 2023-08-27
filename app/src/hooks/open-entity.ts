/* eslint-disable */
// @ts-nocheck
import { browser } from '@/modules/browser'
import { dbi } from '@/modules/db'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setCurrentTab, setOpenTab } from '@/store/reducers/tab.slice'
import { setOpenCurrentTabInWorkSpace, setTabsWorkspace } from '@/store/reducers/workspaces.slice'
import { AppNostro } from '@/types/app-nostro'
import { v4 as uuidv4 } from 'uuid'

function getOrigin(url) {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

export const useOpenApp = () => {
  const dispatch = useAppDispatch()
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const { apps } = useAppSelector((state) => state.apps)
  const { currentPubKey } = useAppSelector((state) => state.keys)

  const getTab = (id) => currentWorkSpace?.tabs.find((t) => t.id === id)

  const hide = async (tab) => {
    await browser.hide(tab.id)
  }

  const API = {
    onHide: (tabId) => {
      console.log('hide', tabId)

      hide(getTab(tabId))
    }
  }

  browser.setAPI(API)

  const createTabBrowser = async (tab) => {
    console.table('createTabBrowser tab id', JSON.stringify(tab))
    dispatch(setOpenTab({ isLoading: true }))

    const params = {
      id: tab.id,
      url: tab.url,
      hidden: true,
      apiCtx: tab.id
    }

    dispatch(setOpenTab({ isOpen: true }))

    dispatch(
      setCurrentTab({
        currentTab: { id: tab.id, name: tab.title, url: tab.url, picture: tab.icon, appNaddr: tab.appNaddr }
      })
    )

    dispatch(
      setOpenCurrentTabInWorkSpace({
        tabID: tab.id,
        isOpened: true
      })
    )

    await browser.open(params)
  }

  const ensureBrowser = async (tab) => {
    if (!tab.isOpened) {
      await createTabBrowser(tab)
    }

    return
  }

  const show = async (tab) => {
    // showTabMenu();
    console.log({ showTab: tab })

    return new Promise((ok) => {
      setTimeout(async () => {
        // schedule the open after task bar is changed

        await ensureBrowser(tab)

        await browser.show(tab.id)

        dispatch(
          setCurrentTab({
            currentTab: { id: tab.id, name: tab.title, url: tab.url, picture: tab.icon, appNaddr: tab.appNaddr }
          })
        )

        // updateWorkspace((ws) => {
        //   const tg = ws.tabGroups[getTabGroupId(tab)];
        //   tg.lastTabId = tab.id;
        //   return { currentTabId: tab.id, tabGroups: { ...ws.tabGroups } };
        // });
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

  const openApp = async (app: AppNostro) => {
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

  return {
    openApp
  }
}
