/* eslint-disable */
// @ts-nocheck
import { browser } from '@/modules/browser'
import { dbi } from '@/modules/db'
import { nip19 } from '@nostrband/nostr-tools'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setIcontab, setLoadingTab, setOpenTab } from '@/store/reducers/tab.slice'
import {
  clearTabGroup,
  deletePermWorkspace,
  removeTabFromTabs,
  setCurrentWorkspace,
  setPermsWorkspace,
  setScreenshotTab,
  setTabsWorkspace,
  setUrlTabWorkspace,
  setWorkspaces
} from '@/store/reducers/workspaces.slice'
import { AppNostro, IOpenAppNostro } from '@/types/app-nostro'
import { getKeys, writeCurrentPubkey } from '@/utils/keys'
import { decode as bolt11Decode } from 'light-bolt11-decoder'
import { v4 as uuidv4 } from 'uuid'
import { useUpdateProfile } from './profile'
import { setCurrentPubKey, setKeys, setReadKeys } from '@/store/reducers/keys.slice'
import { addWorkspace, getOrigin, getTabGroupId } from '@/modules/AppInitialisation/utils'
import { keystore } from '@/modules/keystore'
import { useOpenModalSearchParams } from './modal'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { DEFAULT_PUBKEY } from '@/consts'
import { walletstore } from '@/modules/walletstore'
import { sendPayment, stringToBech32 } from '@/modules/nostr'
import { deletePermissionRequest, setPermissionRequest } from '@/store/reducers/permissionRequests.slice'

export const useOpenApp = () => {
  const [currentTabId, setCurrentTabId] = useState(null) // сохронять промежуточную id табы
  const dispatch = useAppDispatch()
  const updateProfile = useUpdateProfile()
  const { handleOpen, handleClose } = useOpenModalSearchParams()
  const { currentWorkSpace, workspaces } = useAppSelector((state) => state.workspaces)
  const { apps } = useAppSelector((state) => state.apps)
  const { currentPubKey, readKeys } = useAppSelector((state) => state.keys)
  const { openedTabs } = useAppSelector((state) => state.tab)
  const { permissionRequests } = useAppSelector((state) => state.permissionRequests)

  // const [searchParams] = useSearchParams()
  // const currentTabId = searchParams.get('id')

  const getTabAny = (id) => workspaces.map((ws) => ws.tabs.find((t) => t.id === id)).find((t) => t !== undefined) /// ???????????
  const isReadOnly = () => currentPubKey === DEFAULT_PUBKEY || readKeys.includes(currentPubKey) //// ???????????
  const hasPerm = (tab, name, value) => {
    const app = getTabGroupId(tab)
    const ws = workspaces.find((ws) => ws.pubkey === tab.pubkey)
    const perm = ws.perms.find((p) => p.app === app && p.name === name)?.value === value

    return perm
  }

  const replyCurrentPermRequest = async (allow, remember, currentPermId) => {
    const currentPermRequest = permissionRequests.find((perm) => perm.id === currentPermId)
    const tab = currentWorkSpace.tabs.find((t) => t.id === currentPermRequest.tabId)

    console.log('replyCurrentPermRequest', allow, remember, JSON.stringify(currentPermRequest))
    if (remember) {
      const perm = {
        pubkey: tab.pubkey,
        app: getTabGroupId(tab),
        name: currentPermRequest.perm,
        value: allow ? '1' : '0'
      }

      dispatch(setPermsWorkspace({ perm }))

      console.log('adding perm', JSON.stringify(perm))
      await dbi.updatePerm(perm)
    }

    // execute
    try {
      await currentPermRequest.cb(allow)
    } catch (e) {
      console.log('Failed to exec perm callback', e)
    }

    // drop executed request
    const i = permissionRequests.findIndex((pr) => pr.id === currentPermRequest.id)

    if (i >= 0) {
      dispatch(deletePermissionRequest({ id: currentPermRequest.id }))
    } else {
      throw new Error('Perm request not found')
    }

    // more reqs?
    const reqs = permissionRequests.filter((pr) => pr.tabId === currentPermRequest.tabId)

    if (reqs.length > 1) {
      handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_REQ, { search: { id: reqs[1].id }, replace: true })
    }
  }

  const requestPerm = (tab, req, cb) => {
    const r = {
      ...req,
      id: uuidv4(),
      tabId: tab.id,
      cb
    }

    dispatch(setPermissionRequest({ permissionRequest: r }))

    //    console.log("perm request", tab.id, JSON.stringify(r), JSON.stringify(permissionRequests));
    if (currentTabId === tab.id && !permissionRequests.find((perm) => tab.id === perm.tabId)) {
      // permRequests.current.length === 1
      console.log("show perm request modal", r.id);
      handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_REQ, { search: { id: r.id }, replace: true })
      // show request perm modal right now
      // setCurrentPermRequest(r)
      // console.log(JSON.stringify({ permissions: refPermissionReq.current }))
    }
  }

  const requestPermExec = (tab, perm, exec, error) => {
    return new Promise((ok, err) => {
      requestPerm(tab, perm, async (allowed) => {
        try {
          if (allowed) ok(await exec())
          else err(error)
        } catch (e) {
          err(e)
        }
      })
    })
  }

  const deletePermission = async (id: string) => {
    if (id) {
      dispatch(deletePermWorkspace({ id }))
    } else {
      // updateWorkspace((ws) => {
      //   return { perms: [] }
      // })
    }

    await dbi.deletePerms(currentPubKey, id)
  }

  const getTab = (id) => currentWorkSpace?.tabs.find((t) => t.id === id)

  const hide = async (id: string) => {
    setCurrentTabId(null)
    await browser.hide(id)

    setTimeout(async () => {
      const screenshot = await browser.screenshot(id)

      dispatch(setScreenshotTab({ id, screenshot }))

      await dbi.updateTabScreenshot({ id, screenshot })
    }, 0)
  }

  const close = async (id: string) => {
    setCurrentTabId(null)
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

  const onCloseAllGroupTabs = async (tabGrop) => {
    const requestsCloseTabs = tabGrop.tabs.map((id) => close(id))
    await Promise.all(requestsCloseTabs)

    dispatch(
      clearTabGroup({
        tabGrop
      })
    )
  }

  const onSwitchTab = async (tab) => {
    await openBlank(tab, { replace: true })
  }

  const onStopLoadTab = async (id: string) => {
    dispatch(
      setLoadingTab({
        isLoading: false
      })
    )

    await browser.stop(id)
  }

  const onReloadTab = async (id: string) => {
    console.log('onReloadTab')
    dispatch(
      setLoadingTab({
        isLoading: true
      })
    )

    await browser.reload(id).finally(() => {
      dispatch(
        setLoadingTab({
          isLoading: false
        })
      )
    })
  }

  const handleCustomUrl = async (url, tab) => {
    if (url.startsWith('lightning:')) {
      // just open some outside app for now
      window.cordova.InAppBrowser.open(url, '_self')
      return true
    }

    if (url.startsWith('nostr:')) {
      const b32 = stringToBech32(url)
      if (b32) {
        // hide it
        if (tab) await hide(tab.id)

        // offer to choose an app to show the event
        handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: b32 } })
      } else {
        // try some external app that might know this type of nostr: link
        window.cordova.InAppBrowser.open(url, '_self')
      }

      return true
    }

    return false
  }

  const API = {
    // NIP-01
    getPublicKey: async function (tabId) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (currentPubKey === DEFAULT_PUBKEY) throw new Error('No pubkey')
      const error = 'Pubkey disallowed'
      if (hasPerm(tab, 'pubkey', '0')) throw new Error(error)
      if (hasPerm(tab, 'pubkey', '1')) return currentPubKey
      const exec = () => currentPubKey
      return requestPermExec(tab, { perm: 'pubkey' }, exec, error)
    },
    signEvent: async function (tabId, event) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (isReadOnly()) throw new Error('No pubkey')
      const kindPerm = 'sign:' + event.kind
      const allPerm = 'sign'
      const exec = async () => await keystore.signEvent(event)
      // return await exec()

      // // allowed this kind or all kinds (if not kind-0)?
      if (hasPerm(tab, kindPerm, '1') || (event.kind != 0 && hasPerm(tab, allPerm, '1'))) {
        return await exec()
      }

      // disallowed this kind or all kinds
      const error = 'Signing of kind ' + event.kind + ' disallowed'
      if (hasPerm(tab, kindPerm, '0') || hasPerm(tab, allPerm, '0')) {
        throw new Error(error)
      }
      return requestPermExec(tab, { perm: kindPerm, event }, exec, error)
    },
    // NIP-04
    encrypt: async function (tabId, pubkey, plainText) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (isReadOnly()) throw new Error('No pubkey')
      const error = 'Encrypt disallowed'
      if (hasPerm(tab, 'encrypt', '0')) throw new Error(error)
      const exec = async () => await keystore.encrypt(pubkey, plainText)
      if (hasPerm(tab, 'encrypt', '1')) return await exec()
      return requestPermExec(tab, { perm: 'encrypt', pubkey, plainText }, exec, error)
    },
    decrypt: async function (tabId, pubkey, cipherText) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (isReadOnly()) throw new Error('No pubkey')
      const error = 'Decrypt disallowed'
      if (hasPerm(tab, 'decrypt', '0')) throw new Error(error)
      const exec = async () => await keystore.decrypt(pubkey, cipherText)
      if (hasPerm(tab, 'decrypt', '1')) return await exec()
      return requestPermExec(tab, { perm: 'decrypt', pubkey, cipherText }, exec, error)
    },
    // NWC
    getWalletInfo: async function (tabId) {
      console.log('getWalletInfo', tabId)
      return Promise.resolve({
        // some fake info to satisfy Snort
        node: {
          pubkey: '001122334455667788990011223344556677889900112233445566778899001122',
          alias: 'Spring NWC Wallet'
        }
      })
    },
    sendPayment: async function (tabId, paymentRequest) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      // if (isReadOnly()) throw new Error('No pubkey')

      const bolt11 = bolt11Decode(paymentRequest)
      const amount = Number(bolt11.sections?.find((s) => s.name === 'amount').value)

      const wallet = await walletstore.getInfo()
      const perm = 'pay_invoice:' + wallet.id
      const exec = async () => {
        try {
          const res = await sendPayment(wallet, paymentRequest)
          console.log('payment result', res)
          window.plugins.toast.showShortBottom(`Sent ${amount / 1000} sats`)
          return res // forward to the tab
        } catch (e) {
          window.plugins.toast.showShortBottom(`Payment failed: ${e}`)
          throw e // forward to the tab
        }
      }

      // allowed?
      const MAX_ALLOW_AMOUNT = 10000 * 1000 // anything above 10k must be explicitly authorized
      if (amount <= MAX_ALLOW_AMOUNT && hasPerm(tab, perm, '1')) {
        return await exec()
      }

      // disallowed?
      const error = 'Payment request disallowed'
      if (hasPerm(tab, perm, '0')) throw new Error(error)

      return requestPermExec(
        tab,
        {
          perm,
          paymentRequest,
          amount,
          wallet
        },
        exec,
        error
      )
    },
    clipboardWriteText: async function (tabId, text) {
      return await window.cordova.plugins.clipboard.copy(text)
    },
    showContextMenu: async function (tabId, id) {
      console.log('event menu', id)
      handleOpen(MODAL_PARAMS_KEYS.CONTEXT_MENU, {
        search: { id: id },
        replace: true
      })
    },
    share: async function (tabId, data) {
      return await window.navigator.share(data)
    },
    decodeBech32: function (tabId, s) {
      return nip19.decode(s)
    },
    onHide: (tabId) => {
      handleClose('/')
    },
    setUrl: async (tabId, url) => {
      const getTab = (id) => currentWorkSpace.tabs.find((tab) => tab.id === id)
      dispatch(setUrlTabWorkspace({ tab: getTab, url }))
      dbi.updateTab({ ...getTab(tabId), url })
    },
    onLoadStart: async (tabId, event) => {
      console.log('loading', JSON.stringify(event))
      API.setUrl(tabId, event.url)
      dispatch(setLoadingTab({ isLoading: true }))
    },
    onLoadStop: async (tabId, event) => {
      console.log('loaded', event.url)
      API.setUrl(tabId, event.url)
      dispatch(setLoadingTab({ isLoading: false }))
    },
    onClick: (tabId, x, y) => {
      console.log('click', x, y)
      let e = document.elementFromPoint(x, y)
      // SVG doesn't have 'click'
      while (e && !e.click) e = e.parentNode
      console.log('click on ', e)
      if (e) e.click()
    },
    onBlank: async (tabId, url) => {
      const tab = getTabAny(tabId)
      console.log('onBlank', tabId, tab?.url, url)
      // some special scheme?
      if (await handleCustomUrl(url, tab)) return
      // new tab coming, hide current one
      if (tab) await hide(tab) // ????
      // just open another tab
      openBlank({ url }, { replace: true })
    },
    onBeforeLoad: async (tabId, url) => {
      const tab = getTabAny(tabId)
      console.log('onBeforeLoad', tabId, tab?.url, url)
      // intercept lightning: and nostr: links
      return await handleCustomUrl(url, tab)
    },
    onIcon: async (tabId, icon) => {
      setIcontab({ id: tabId, icon })

      const tab = getTabAny(tabId)
      if (tab) {
        dbi.updateTab({ ...tab, icon })
      }
    }
  }

  browser.setAPI(API)

  const openTabWindow = async (id) => {
    const isOpened = openedTabs.find((tab) => id === tab.id)

    if (isOpened) {
      console.log('SHOW')
      await browser.show(id)
    } else {
      const tab = currentWorkSpace.tabs.find((tab) => id === tab.id)
      const dataTabForOpen = {
        id: tab.id,
        url: tab.url,
        hidden: true,
        apiCtx: tab.id
      }

      console.log('CREATE', tab)

      dispatch(setOpenTab({ tab: dataTabForOpen }))

      await browser.open(dataTabForOpen)
      await browser.show(id)
    }
  }

  const show = (tab, options) => {
    // const isOpened = openedTabs.find((openedTab) => tab.id === openedTab.id)

    // let searchParams = {
    //   id: tab.id,
    //   method: 'show'
    // }

    // if (!isOpened) {
    //   const dataTabForOpen = {
    //     id: tab.id,
    //     url: tab.url,
    //     hidden: true,
    //     apiCtx: tab.id
    //   }

    //   // searchParams.method = 'create'

    //   dispatch(setOpenTab({ tab: dataTabForOpen }))
    // }

    setCurrentTabId(tab.id)

    handleOpen(MODAL_PARAMS_KEYS.TAB_MODAL, {
      search: { id: tab.id },
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

    if (entity.url.startsWith('nostr:')) {
      // try some external app that might know this type of nostr: link
      window.cordova.InAppBrowser.open(entity.url, '_self')
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
    openBlank,
    replyCurrentPermRequest,
    deletePermission,
    onCloseAllGroupTabs
  }
}
