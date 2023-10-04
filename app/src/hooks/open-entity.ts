/* eslint-disable */
// @ts-nocheck
import { browser } from '@/modules/browser'
import { dbi } from '@/modules/db'
import { nip19 } from '@nostrband/nostr-tools'
import { bech32 } from '@scure/base'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import {
  setTabIcon,
  setTabTitle,
  setTabIsLoading,
  setOpenTab,
  setCurrentTabId,
  addTabs,
  setTabScreenshot,
  setTabUrl,
  setTabCreated,
  removeTab
} from '@/store/reducers/tab.slice'
import {
  deletePermWorkspace,
  removePinWorkspace,
  removeTabWorkspace,
  setLastKindApp,
  setPermsWorkspace,
  addTabWorkspace,
  addWorkspaces,
  addPinWorkspace,
  updatePinWorkspace
} from '@/store/reducers/workspaces.slice'
import { AppNostr, IOpenAppNostr } from '@/types/app-nostr'
import { decode as bolt11Decode } from 'light-bolt11-decoder'
import { v4 as uuidv4 } from 'uuid'
import { useUpdateProfile } from './profile'
import {
  loadWorkspace,
  getOrigin,
  getTabGroupId,
  writeCurrentPubkey,
  loadKeys
} from '@/modules/AppInitialisation/utils'
import { keystore } from '@/modules/keystore'
import { useOpenModalSearchParams } from './modal'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { DEFAULT_PUBKEY } from '@/consts'
import { walletstore } from '@/modules/walletstore'
import { AppHandlerEvent, nsbSignEvent, sendPayment, stringToBech32 } from '@/modules/nostr'
import {
  deletePermissionRequest,
  setPermissionRequest,
  setPermissionRequestProcessing
} from '@/store/reducers/permissionRequests.slice'
import { ITab } from '@/types/tab'
import { selectCurrentWorkspace, selectCurrentWorkspaceTabs } from '@/store/store'
import { IPin } from '@/types/workspace'

export const useOpenApp = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const updateProfile = useUpdateProfile()
  const { handleOpen, handleClose } = useOpenModalSearchParams()
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubkey, keys, readKeys, nsbKeys } = useAppSelector((state) => state.keys)
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const { apps } = useAppSelector((state) => state.apps)
  const { tabs, currentTabId } = useAppSelector((state) => state.tab)
  const { permissionRequests } = useAppSelector((state) => state.permissionRequests)
  const currentWorkSpaceTabs = useAppSelector(selectCurrentWorkspaceTabs)
  const { page } = useAppSelector((state) => state.positionScrollPage)

  const getTabAny = (id) => tabs.find((t) => t.id === id)
  const isReadOnly = () => currentPubkey === DEFAULT_PUBKEY || readKeys.includes(currentPubkey)
  const isNsbKey = () => nsbKeys.includes(currentPubkey)
  const hasPerm = (tab, name, value) => {
    const app = getTabGroupId(tab)
    const ws = workspaces.find((ws) => ws.pubkey === tab.pubkey)
    const perm = ws.perms.find((p) => p.app === app && p.name === name)?.value === value

    return perm
  }

  const replyCurrentPermRequest = async (allow, remember, currentPermId) => {
    const currentPermRequest = permissionRequests.find((perm) => perm.id === currentPermId)
    const tab = getTabAny(currentPermRequest.tabId)

    // mark as active
    dispatch(setPermissionRequestProcessing({ id: currentPermRequest.id }))

    console.log('replyCurrentPermRequest', allow, remember, JSON.stringify(currentPermRequest))
    if (remember) {
      const perm = {
        pubkey: tab.pubkey,
        app: getTabGroupId(tab),
        name: currentPermRequest.perm,
        value: allow ? '1' : '0'
      }

      dispatch(setPermsWorkspace({ perm, workspacePubkey: tab.pubkey }))

      console.log('adding perm', JSON.stringify(perm))
      dbi.updatePerm(perm)
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
      handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_REQ, { search: { permId: reqs[1].id } })
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

    console.log(
      'perm request',
      tab.id,
      'currentTabId',
      currentTabId,
      JSON.stringify(r),
      JSON.stringify(permissionRequests)
    )
    if (currentTabId === tab.id && !permissionRequests.find((perm) => tab.id === perm.tabId)) {
      // permRequests.current.length === 1
      console.log('show perm request modal', r.id)
      handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_REQ, { search: { permId: r.id } })
      // show request perm modal right now
      // setCurrentPermRequest(r)
      // console.log(JSON.stringify({ permissions: refPermissionReq.current }))
    }
  }

  const showPendingPermRequest = (tabId) => {
    const r = permissionRequests.find((perm) => tabId === perm.tabId)
    if (!r || r.processing) return

    console.log('show pending perm request modal', r.id)
    handleOpen(MODAL_PARAMS_KEYS.PERMISSIONS_REQ, { search: { permId: r.id } })
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
    dispatch(deletePermWorkspace({ id, workspacePubkey: currentPubkey }))

    dbi.deletePerms(currentPubkey, id)
  }

  const hide = async (id: string) => {
    dispatch(setCurrentTabId({ id: null }))
    await browser.hide(id)

    setTimeout(async () => {
      const screenshot = await browser.screenshot(id)

      dispatch(setTabScreenshot({ id, screenshot }))

      dbi.updateTabScreenshot({ id, screenshot })
    }, 0)
  }

  const close = async (id: string) => {
    dispatch(setCurrentTabId({ id: null }))
    await browser.close(id)
    dbi.deleteTab(id)
  }

  const onHideTabInBrowser = async (id: string) => {
    await hide(id)
  }

  const onHideTab = () => {
    handleClose(location.pathname)
  }

  const onCloseTab = async (id: string) => {
    const pubkey = getTabAny(id)?.pubkey
    await close(id)

    dispatch(removeTab({ id }))
    dispatch(
      removeTabWorkspace({
        id,
        workspacePubkey: pubkey
      })
    )
  }

  const onCloseTabs = async (tabs: ITab[]) => {
    const requestsCloseTabs = tabs.map((t) => onCloseTab(t.id))
    await Promise.all(requestsCloseTabs)
  }

  const onSwitchTab = async (tab) => {
    await openBlank(tab, { replace: true })
  }

  const onStopLoadTab = async (id: string) => {
    await browser.stop(id)

    dispatch(setTabIsLoading({ id, isLoading: false }))
  }

  const onReloadTab = async (id: string) => {
    dispatch(setTabIsLoading({ id, isLoading: true }))

    await browser.reload(id)
  }

  const handleCustomUrl = async (url, tab) => {
    if (url.startsWith('intent:')) {
      console.log('intent url disallowed', tab?.id, url)
      return true
    }

    if (url.startsWith('lightning:') && !!tab) {
      try {
        await walletstore.getInfo()
        sendTabPayment(tab.id, url.split(':')[1])
      } catch (e) {
        // just open some outside app for now
        window.cordova.InAppBrowser.open(url, '_self')
      }
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

  const sendTabPayment = async (tabId, paymentRequest) => {
    const tab = getTabAny(tabId)
    if (!tab) throw new Error('Inactive tab')

    const bolt11 = bolt11Decode(paymentRequest)
    const amount = Number(bolt11.sections?.find((s) => s.name === 'amount').value)

    const error = 'Payment request disallowed'
    let wallet = null
    try {
      wallet = await walletstore.getInfo()
    } catch (e) {
      window.plugins.toast.showShortBottom(`Add wallet first!`)
      // don't let app distinguish btw no-wallet and disallowed
      throw new Error(error)
    }

    const perm = 'pay_invoice:' + wallet.id
    const exec = async () => {
      try {
        console.log('sending payment', paymentRequest)
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
  }

  const backToLastPage = () => {
    if (page === '/') {
      handleClose('/')
    } else {
      handleClose(`?page=${page}`)
    }
  }

  const releaseTab = async (tabId) => {
    console.log("releaseTab", tabId)
    await browser.canRelease(tabId)
  }

  const API = {
    // NIP-01
    getPublicKey: async function (tabId) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (currentPubkey === DEFAULT_PUBKEY) throw new Error('No pubkey')
      const error = 'Pubkey disallowed'
      if (hasPerm(tab, 'pubkey', '0')) throw new Error(error)
      if (hasPerm(tab, 'pubkey', '1')) return currentPubkey
      const exec = () => currentPubkey
      return requestPermExec(tab, { perm: 'pubkey' }, exec, error)
    },
    signEvent: async function (tabId, event) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (isReadOnly()) throw new Error('No pubkey')
      const kindPerm = 'sign:' + event.kind
      const allPerm = 'sign'
      const exec = async () => {
        if (nsbKeys.includes(tab.pubkey)) return await nsbSignEvent(tab.pubkey, event)
        else return await keystore.signEvent(event)
      }
      // return await exec()

      // // allowed this kind or all kinds (if not kind-0)?
      if (hasPerm(tab, kindPerm, '1') || (event.kind != 0 && hasPerm(tab, allPerm, '1'))) {
        console.log('has perm allow for ', kindPerm)
        return await exec()
      }

      // disallowed this kind or all kinds
      const error = 'Signing of kind ' + event.kind + ' disallowed'
      if (hasPerm(tab, kindPerm, '0') || hasPerm(tab, allPerm, '0')) {
        console.log('has perm disallow for ', kindPerm)
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

    sendPayment: sendTabPayment,

    clipboardWriteText: async function (tabId, text) {
      const r = await window.cordova.plugins.clipboard.copy(text)
      window.plugins.toast.showShortBottom('Copied')
      return r
    },
    clipboardReadText: async function (tabId) {
      return new Promise((ok) => {
        window.cordova.plugins.clipboard.paste(ok)
      })
    },
    showContextMenu: async function (tabId, data) {
      console.log('event menu', JSON.stringify(data))
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      data.tabUrl = tab.url
      data.tabId = tab.id
      handleOpen(MODAL_PARAMS_KEYS.CONTEXT_MENU, {
        search: data
      })
    },
    share: async function (tabId, data) {
      return await window.navigator.share(data)
    },
    decodeBech32: function (tabId, s) {
      if (
        s.startsWith('npub1') ||
        s.startsWith('note1') ||
        s.startsWith('nevent1') ||
        s.startsWith('naddr1') ||
        s.startsWith('nprofile1')
      ) {
        return nip19.decode(s)
      } else {
        console.log('decode', s)
        const { prefix, words } = bech32.decode(s, s.length)
        console.log('decoded', prefix, words)
        const data = new Uint8Array(bech32.fromWords(words))
        return { type: prefix, data }
      }
    },
    onHide: (tabId) => {
      backToLastPage()
      // it's very common to open a tab, read it and hit 'back',
      // most of the time it means user won't need the tab any more,
      // but we won't delete the tab, we just release the webview,
      // it will be re-created if needed. 
      releaseTab(tabId)
    },
    setUrl: async (tabId, url) => {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')

      // domain change?
      if (getOrigin(tab.url) != getOrigin(url)) {
        const app = apps?.find((a) => url.startsWith(a.url))
        if (app) {
          dispatch(setTabTitle({ id: tabId, title: app.name }))
          dispatch(setTabIcon({ id: tabId, icon: app.picture }))
        } else {
          dispatch(setTabTitle({ id: tabId, title: getOrigin(url) }))
          dispatch(setTabIcon({ id: tabId, icon: '' }))
        }
      }

      dispatch(setTabUrl({ id: tabId, url }))
      dbi.updateTab({ ...tab, url })
    },
    onLoadStart: async (tabId, event) => {
      console.log('loading', JSON.stringify(event))
      API.setUrl(tabId, event.url)
      dispatch(setTabIsLoading({ id: tabId, isLoading: true }))
    },
    onLoadStop: async (tabId, event) => {
      console.log('loaded', event.url)
      API.setUrl(tabId, event.url)
      dispatch(setTabIsLoading({ id: tabId, isLoading: false }))
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
      setTabIcon({ id: tabId, icon })

      const tab = getTabAny(tabId)
      if (tab) {
        dbi.updateTab({ ...tab, icon })
      }
    }
  }

  browser.setAPI(API)

  const onPinApp = async (app: AppNostr) => {
    const pin: IPin = {
      id: uuidv4(),
      url: app.url,
      appNaddr: app.naddr,
      title: app?.title || app?.name, // FIXME why there title instead name?
      icon: app.picture,
      order: currentWorkSpace.pins.length,
      pubkey: currentWorkSpace.pubkey
    }

    dispatch(addPinWorkspace({ pin, workspacePubkey: currentWorkSpace.pubkey }))

    dbi.addPin(pin)
  }

  const onPinTab = async (currentTab: ITab) => {
    const pin: IPin = {
      id: uuidv4(),
      url: currentTab.url,
      //      appNaddr: currentTab.appNaddr,
      title: currentTab.title,
      icon: currentTab.icon,
      order: currentWorkSpace.pins.length,
      pubkey: currentTab.pubkey
    }

    dispatch(addPinWorkspace({ pin, workspacePubkey: currentTab.pubkey }))

    dbi.addPin(pin)
  }

  const findTabPin = (tab: ITab): IPin | undefined => {
    const ws = workspaces.find((ws) => ws.pubkey === tab.pubkey)
    return ws?.pins.find(
      (p) => p.url === tab.url // p.appNaddr === tab.appNaddr ||
    )
  }

  const findAppPin = (app: AppNostr | AppHandlerEvent): IPin | undefined => {
    return currentWorkSpace?.pins.find(
      (p) => p.appNaddr === app.appNaddr || app.url?.startsWith(p.url) || app.eventUrl?.startsWith(p.url)
    )
  }

  const onUnPinTab = async (currentTab: ITab) => {
    const pin = findTabPin(currentTab)
    dispatch(removePinWorkspace({ id: pin.id, workspacePubkey: currentTab.pubkey }))
    dbi.deletePin(pin.id)
  }

  const onDeletePinnedApp = async (currentPin: IPin) => {
    dispatch(removePinWorkspace({ id: currentPin.id, workspacePubkey: currentPin.pubkey }))
    dbi.deletePin(currentPin.id)
  }

  const onUpdatePinnedApp = async (currentPin: IPin) => {
    dispatch(updatePinWorkspace({ pin: currentPin, workspacePubkey: currentPin.pubkey }))
    dbi.updatePin(currentPin)
  }

  const openTabWindow = async (id) => {
    const tab = tabs.find((tab) => id === tab.id)
    if (!tab) {
      console.log(`Error: tab ${id} doesn't exist`)
      return
    }

    dispatch(setCurrentTabId({ id }))

    if (tab.created) {
      console.log('show tab', id)
      await browser.show(id)
    } else {
      console.log('openTabWindow', id, tab)

      const dataTabForOpen = {
        id: tab.id,
        url: tab.url,
        apiCtx: tab.id
      }

      dispatch(setTabCreated({ id }))

      await browser.open(dataTabForOpen)
      await browser.show(id)
    }

    await showPendingPermRequest(id)
  }

  const show = (tab, options) => {
    console.log('show', tab.id, JSON.stringify(options))

    handleOpen(MODAL_PARAMS_KEYS.TAB_MODAL, {
      search: { tabId: tab.id },
      ...options
    })
  }

  const open = async (params, options) => {
    console.log('open', JSON.stringify(params))

    let { url, title = '', icon = '' } = params

    try {
      const U = new URL(url)
      if (!title) title = U.hostname.startsWith('www.') ? U.hostname.substring(4) : U.hostname
      if (!icon) icon = U.origin + '/favicon.ico'
    } catch {
      if (!title) title = url
    }

    const tab: ITab = {
      url,
      id: uuidv4(),
      pubkey: currentPubkey,
      title: title,
      icon: icon,
      //      appNaddr: params.appNaddr,
      order: tabs.length,
      created: false,
      loading: true,
      lastActive: Date.now()
    }
    // console.log("open", url, JSON.stringify(params), JSON.stringify(tab));

    // add to tab list
    dispatch(addTabs({ tabs: [tab] }))
    dispatch(addTabWorkspace({ id: tab.id, workspacePubkey: currentPubkey }))

    // add to db
    dbi.addTab(tab)

    // it creates the tab and sets as current
    show(tab, options)
  }

  const openBlank = async (entity: object, options) => {
    const tab = currentWorkSpaceTabs.find((tab) => tab.url === entity.url)

    if (tab) {
      show(tab, options)
      return
    }

    if (entity.url.startsWith('intent:')) {
      // external browser
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
          icon: app.picture,
          title: app.name
          //          appNaddr: app.naddr,
        },
        options
      )

      return
    }

    // nothing's known about this url, open a new tab
    await open(entity, options)
  }

  const openApp = async (app: IOpenAppNostr, options?: { replace?: boolean } = { replace: false }) => {
    if (app.kind !== undefined) {
      dispatch(setLastKindApp({ kind: app.kind, naddr: app.naddr, workspacePubkey: currentPubkey }))
    }

    await openBlank(
      {
        url: app.url,
        appNaddr: app.naddr,
        title: app.name,
        icon: app.picture
      },
      options
    )
  }

  const openZap = (id) => {
    const ZAP_URL = 'https://zapper.nostrapps.org/zap?id='
    openBlank({ url: `${ZAP_URL}${id}` }, { replace: true })
  }

  return {
    openApp,
    onStopLoadTab,
    onReloadTab,
    onHideTab,
    onSwitchTab,
    onHideTabInBrowser,
    onCloseTab,
    openTabWindow,
    openBlank,
    replyCurrentPermRequest,
    deletePermission,
    onCloseTabs,
    openZap,
    onPinApp,
    onPinTab,
    onUnPinTab,
    findTabPin,
    findAppPin,
    sendTabPayment,
    onDeletePinnedApp,
    onUpdatePinnedApp,
    backToLastPage,
  }
}
