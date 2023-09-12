/* eslint-disable */
// @ts-nocheck
import { browser } from '@/modules/browser'
import { dbi } from '@/modules/db'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setLoadingTab, setOpenTab } from '@/store/reducers/tab.slice'
import {
  removeTabFromTabs,
  setCurrentWorkspace,
  setTabsWorkspace,
  setUrlTabWorkspace,
  setWorkspaces
} from '@/store/reducers/workspaces.slice'
import { AppNostro, IOpenAppNostro } from '@/types/app-nostro'
import { getKeys, writeCurrentPubkey } from '@/utils/keys'
import { v4 as uuidv4 } from 'uuid'
import { useUpdateProfile } from './profile'
import { setCurrentPubKey, setKeys, setReadKeys } from '@/store/reducers/keys.slice'
import { addWorkspace, getOrigin, getTabGroupId } from '@/modules/AppInitialisation/utils'
import { keystore } from '@/modules/keystore'
import { useOpenModalSearchParams } from './modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useSearchParams } from 'react-router-dom'

export const useOpenApp = () => {
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const { handleOpen, handleClose } = useOpenModalSearchParams()
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const { apps } = useAppSelector((state) => state.apps)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const { currentTab, openedTabs } = useAppSelector((state) => state.tab)

  const [searchParams] = useSearchParams()
  const test = searchParams.get('id')

  const getTab = (id) => currentWorkSpace?.tabs.find((t) => t.id === id)

  const hide = async (id: string) => {
    await browser.hide(id)
  }

  const close = async (id: string) => {
    await dbi.deleteTab(id)
    await browser.close(id)
  }

  const onHideTabInBrowser = async (id: string) => {
    await hide(id)
  }

  const onHideTab = () => {
    handleClose('/')
  }

  const onCloseTab = async (id: string) => {
    await close(id)

    dispatch(
      removeTabFromTabs({
        id
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
      handleClose('/')
    },
    setUrl: async (tabId, url) => {
      // const getTab = (id) => currentWorkSpace.tabs.find((tab) => tab.id === id)
      // dispatch(setUrlTabWorkspace({ tab: getTab, url }))
      // dbi.updateTab({ ...getTab(tabId), url }) ??????????????????????????????????????????????
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

  const openTabWindow = async (id, method) => {
    if (method === 'create') {
      const tab = currentWorkSpace.tabs.find((tab) => id === tab.id)
      const dataTabForOpen = {
        id: tab.id,
        url: tab.url,
        hidden: true,
        apiCtx: tab.id
      }

      console.log('CREATE', tab)

      await browser.open(dataTabForOpen)
      await browser.show(id)
    } else {
      console.log('SHOW')
      await browser.show(id)
    }
  }

  const show = (tab, options) => {
    const isOpened = openedTabs.find((openedTab) => tab.id === openedTab.id)

    let searchParams = {
      id: tab.id,
      method: 'show'
    }

    if (!isOpened) {
      const dataTabForOpen = {
        id: tab.id,
        url: tab.url,
        hidden: true,
        apiCtx: tab.id
      }

      searchParams.method = 'create'

      dispatch(setOpenTab({ tab: dataTabForOpen }))
    }

    handleOpen(MODAL_PARAMS_KEYS.TAB_MODAL, {
      search: searchParams,
      ...options
    })
  }

  const open = async (params, options) => {
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

    // add to tab list
    dispatch(setTabsWorkspace({ tab }))

    // add to db
    await dbi.addTab(tab)

    // it creates the tab and sets as current
    show(tab, options)
  }

  const openBlank = async (entity: AppNostro, options) => {
    const tab = currentWorkSpace.tabs.find((tab) => tab.url === entity.url)

    if (tab) {
      show(tab, options)
      return
    }

    // // find an existing app for this url
    const origin = getOrigin(entity.url)
    const app = entity.appNaddr
      ? apps.find((app) => app.naddr === entity.appNaddr)
      : apps.find((app) => app.url.startsWith(origin))

    if (app) {
      await open(
        {
          url: entity.url,
          pinned: entity.pinned,
          icon: app.picture,
          title: app.name,
          appNaddr: app.naddr,
          replace: app.replace
        },
        options
      )

      return
    }

    // nothing's known about this url, open a new tab
    await open(entity, options)
  }

  const openApp = async (app: IOpenAppNostro, options?: { replace?: boolean } = { replace: false }) => {
    // if (params.kind !== undefined) {
    //   updateWorkspace((ws) => {
    //     ws.lastKindApps[params.kind] = params.naddr;
    //     return {
    //       lastKindApps: { ...ws.lastKindApps },
    //     };
    //   });
    // }
    const pin = currentWorkSpace.pins.find((pin) => pin.appNaddr == app.naddr)

    await openBlank(
      {
        url: app.url,
        pinned: !!pin,
        appNaddr: app.naddr,
        title: app.name,
        icon: app.picture,
        replace: app.replace
      },
      options
    )
  }

  const onImportKey = async (importPubkey?: string) => {
    if (importPubkey) {
      await dbi.putReadOnlyKey(importPubkey)
      await writeCurrentPubkey(importPubkey)
    } else {
      const r = await keystore.addKey()

      await writeCurrentPubkey(r.pubkey)
    }

    // // reload the list
    const [keys, pubkey, readKeys] = await getKeys()
    dispatch(setKeys({ keys }))
    dispatch(setReadKeys({ readKeys }))
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
    onImportKey,
    onCloseTab,
    openTabWindow,
    openBlank
  }
}
