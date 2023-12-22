import { browser } from '@/modules/browser'
import { dbi } from '@/modules/db'
import { nip19 } from '@nostrband/nostr-tools'
import { bech32 } from '@scure/base'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import {
  setTabIcon,
  setTabTitle,
  setTabIsLoading,
  setCurrentTabId,
  addTabs,
  setTabScreenshot,
  setTabUrl,
  setTabCreated,
  removeTab
} from '@/store/reducers/tab.slice'
import { removeTabWorkspace, setLastKindApp, addTabWorkspace } from '@/store/reducers/workspaces.slice'
import { IOpenAppNostr } from '@/types/app-nostr'
// eslint-disable-next-line
// @ts-ignore
import { decode as bolt11Decode } from 'light-bolt11-decoder'
import { v4 as uuidv4 } from 'uuid'
import { useOpenModalSearchParams } from './modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { DEFAULT_PUBKEY } from '@/consts'
import { walletstore } from '@/modules/walletstore'
import { sendPayment, stringToBech32 } from '@/modules/nostr'
import { ITab } from '@/types/tab'
import { selectCurrentWorkspaceTabs } from '@/store/store'
import { showToast } from '@/utils/helpers/general'
import { useSigner } from './signer'
import { getOrigin, isGuest } from '@/utils/helpers/prepare-data'
import { usePerms } from './perms'
// eslint-disable-next-line
// @ts-ignore
import { NostrEvent } from '@nostrband/ndk'
import { useCallback } from 'react'

export const useOpenApp = () => {
  const dispatch = useAppDispatch()
  const { handleOpen, handleClose, handleOpenContextMenu } = useOpenModalSearchParams()
  const { currentPubkey, readKeys } = useAppSelector((state) => state.keys)
  const { apps } = useAppSelector((state) => state.apps)
  const { tabs } = useAppSelector((state) => state.tab)
  const currentWorkSpaceTabs = useAppSelector(selectCurrentWorkspaceTabs)
  const { signEvent, encrypt, decrypt } = useSigner()
  const { showPendingPermRequest, requestPermExec, replyCurrentPermRequest, hasPerm, deletePermission } = usePerms()

  const getTabAny = useCallback(
    (id: string) => {
      return tabs.find((t) => t.id === id)
    },
    [tabs]
  )

  const isReadOnly = useCallback(() => {
    return isGuest(currentPubkey) || readKeys.includes(currentPubkey)
  }, [currentPubkey, readKeys])

  const hide = useCallback(
    async (id: string) => {
      dispatch(setCurrentTabId({ id: null }))
      await browser.hide(id)

      setTimeout(async () => {
        const screenshot = await browser.screenshot(id)

        dispatch(setTabScreenshot({ id, screenshot }))

        dbi.updateTabScreenshot({ id, screenshot })
      }, 0)
    },
    [dispatch]
  )

  const close = useCallback(
    async (id: string) => {
      dispatch(setCurrentTabId({ id: null }))
      await browser.close(id)
      dbi.deleteTab(id)
    },
    [dispatch]
  )

  const onHideTabInBrowser = useCallback(
    async (id: string) => {
      await hide(id)
    },
    [hide]
  )

  const onCloseTab = useCallback(
    async (id: string) => {
      const pubkey = getTabAny(id)?.pubkey
      await close(id)

      dispatch(removeTab({ id }))
      dispatch(
        removeTabWorkspace({
          id,
          workspacePubkey: pubkey
        })
      )
    },
    [getTabAny, close, dispatch]
  )

  const onCloseTabs = useCallback(
    async (tabs: ITab[]) => {
      const requestsCloseTabs = tabs.map((t) => onCloseTab(t.id))
      await Promise.all(requestsCloseTabs)
    },
    [tabs, onCloseTab]
  )

  const openTabWindow = useCallback(
    async (id: string) => {
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
    },
    [tabs, dispatch, showPendingPermRequest]
  )

  const show = useCallback(
    // eslint-disable-next-line
    (tab: ITab, options: any) => {
      console.log('show', tab.id, JSON.stringify(options))

      handleOpen(MODAL_PARAMS_KEYS.TAB_MODAL, {
        search: { tabId: tab.id },
        ...options
      })
    },
    [handleOpen]
  )

  const open = useCallback(
    // eslint-disable-next-line
    async (params: any, options: any) => {
      console.log('open', JSON.stringify(params))

      // eslint-disable-next-line
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
    },
    [currentPubkey, tabs, dispatch, show]
  )

  const openBlank = useCallback(
    // eslint-disable-next-line
    async (entity: any, options: any) => {
      const tab = currentWorkSpaceTabs.find((tab) => tab.url === entity.url)

      if (tab) {
        show(tab, options)
        return
      }

      // external browser or app
      if (entity.url.startsWith('intent:') || entity.url.startsWith('nostr:')) {
        // eslint-disable-next-line
        // @ts-ignore
        window.cordova.InAppBrowser.open(entity.url, '_self')
        return
      }

      // find an existing app for this url
      const app = entity.appNaddr
        ? (apps || []).find((app) => app.naddr === entity.appNaddr)
        : (apps || []).find((app) => entity.url.startsWith(app.url))

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
    },
    [currentWorkSpaceTabs, show, apps, open]
  )

  const openApp = useCallback(
    async (app: IOpenAppNostr, options: { replace?: boolean } = { replace: false }) => {
      if (app.kind !== undefined) {
        dispatch(setLastKindApp({ workspacePubkey: currentPubkey, app }))
        const id = currentPubkey + app.kind
        dbi.putLastKindApp({ id, pubkey: currentPubkey, ...app })
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
    },
    [dispatch, currentPubkey, openBlank]
  )

  const onSwitchTab = useCallback(
    async (tab: ITab) => {
      await openBlank(tab, { replace: false })
    },
    [openBlank]
  )

  const onStopLoadTab = useCallback(
    async (id: string) => {
      await browser.stop(id)

      dispatch(setTabIsLoading({ id, isLoading: false }))
    },
    [dispatch]
  )

  const onReloadTab = useCallback(
    async (id: string) => {
      dispatch(setTabIsLoading({ id, isLoading: true }))

      await browser.reload(id)
    },
    [dispatch]
  )

  const sendTabPayment = useCallback(
    async (tabId: string, paymentRequest: string) => {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')

      const bolt11 = bolt11Decode(paymentRequest)
      // eslint-disable-next-line
      const amount = Number(bolt11.sections?.find((s: any) => s.name === 'amount')?.value)
      // eslint-disable-next-line
      const descriptionHash = bolt11.sections?.find((s: any) => s.name === 'description_hash')?.value
      console.log('descriptionHash', descriptionHash)

      const error = 'Payment request disallowed'
      // eslint-disable-next-line
      let wallet: any = null
      try {
        wallet = await walletstore.getInfo()
      } catch (e) {
        showToast(`Add wallet first!`)
        // don't let app distinguish btw no-wallet and disallowed
        throw new Error(error)
      }

      const payment = {
        id: uuidv4(),
        preimage: '',
        amount,
        walletName: wallet.name,
        walletId: wallet.id,
        pubkey: currentPubkey,
        url: tab.url,
        timestamp: Date.now(),
        invoice: paymentRequest,
        descriptionHash
      }

      const perm = 'pay_invoice:' + wallet.id
      const exec = async () => {
        try {
          console.log('sending payment', paymentRequest)
          await dbi.addPayment(payment)

          const res = await sendPayment(wallet, paymentRequest)

          // eslint-disable-next-line
          // @ts-ignore
          await dbi.updatePayment(payment.id, res.preimage)
          console.log('payment result', res)
          showToast(`Sent ${amount / 1000} sats`)
          return res // forward to the tab
        } catch (e) {
          showToast(`Payment failed: ${e}`)
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
    },
    [getTabAny, hasPerm, requestPermExec]
  )

  const handleCustomUrl = useCallback(
    async (url: string, tab?: ITab) => {
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
          // eslint-disable-next-line
          // @ts-ignore
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
          handleOpenContextMenu({ bech32: b32 })
        } else {
          // try some external app that might know this type of nostr: link
          // eslint-disable-next-line
          // @ts-ignore
          window.cordova.InAppBrowser.open(url, '_self')
        }

        return true
      }

      return false
    },
    [sendTabPayment, hide, handleOpenContextMenu]
  )

  const backToLastPage = useCallback(() => {
    handleClose()
  }, [handleClose])

  const releaseTab = useCallback(async (tabId: string) => {
    console.log('releaseTab', tabId)
    await browser.canRelease(tabId)
  }, [])

  const API = {
    // NIP-01
    getPublicKey: async function (tabId: string) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (currentPubkey === DEFAULT_PUBKEY) throw new Error('No pubkey')
      const error = 'Pubkey disallowed'
      if (hasPerm(tab, 'pubkey', '0')) throw new Error(error)
      if (hasPerm(tab, 'pubkey', '1')) return currentPubkey
      const exec = () => currentPubkey
      return requestPermExec(tab, { perm: 'pubkey' }, exec, error)
    },
    signEvent: async function (tabId: string, event: NostrEvent) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (isReadOnly()) throw new Error('No pubkey')
      const kindPerm = 'sign:' + event.kind
      const allPerm = 'sign'
      const exec = async () => await signEvent(event, tab.pubkey, tab.url)

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
    encrypt: async function (tabId: string, pubkey: string, plainText: string) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (isReadOnly()) throw new Error('No pubkey')
      const error = 'Encrypt disallowed'
      if (hasPerm(tab, 'encrypt', '0')) throw new Error(error)
      const exec = async () => await encrypt(plainText, pubkey)
      if (hasPerm(tab, 'encrypt', '1')) return await exec()
      return requestPermExec(tab, { perm: 'encrypt', pubkey, plainText }, exec, error)
    },
    decrypt: async function (tabId: string, pubkey: string, cipherText: string) {
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      if (isReadOnly()) throw new Error('No pubkey')
      const error = 'Decrypt disallowed'
      if (hasPerm(tab, 'decrypt', '0')) throw new Error(error)
      const exec = async () => await decrypt(cipherText, pubkey)
      if (hasPerm(tab, 'decrypt', '1')) return await exec()
      return requestPermExec(tab, { perm: 'decrypt', pubkey, cipherText }, exec, error)
    },
    // NWC
    getWalletInfo: async function (tabId: string) {
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

    clipboardWriteText: async function (_: string, text: string) {
      // eslint-disable-next-line
      // @ts-ignore
      const r = await window.cordova.plugins.clipboard.copy(text)
      showToast('Copied')
      return r
    },
    // eslint-disable-next-line
    clipboardReadText: async function (_: string) {
      return new Promise((ok) => {
        // eslint-disable-next-line
        // @ts-ignore
        window.cordova.plugins.clipboard.paste(ok)
      })
    },
    // eslint-disable-next-line
    showContextMenu: async function (tabId: string, data: any) {
      console.log('event menu', JSON.stringify(data))
      const tab = getTabAny(tabId)
      if (!tab) throw new Error('Inactive tab')
      data.tabUrl = tab.url
      data.tabId = tab.id
      handleOpen(MODAL_PARAMS_KEYS.CONTEXT_MENU, {
        search: data
      })
    },
    // eslint-disable-next-line
    share: async function (_: string, data: any) {
      return await window.navigator.share(data)
    },
    decodeBech32: function (_: string, s: string) {
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
    onHide: (tabId: string) => {
      //backToLastPage()
      handleClose()

      // it's very common to open a tab, read it and hit 'back',
      // most of the time it means user won't need the tab any more,
      // but we won't delete the tab, we just release the webview,
      // it will be re-created if needed.
      releaseTab(tabId)
    },
    setUrl: async (tabId: string, url: string) => {
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
    // eslint-disable-next-line
    onLoadStart: async (tabId: string, event: any) => {
      console.log('loading', JSON.stringify(event))
      API.setUrl(tabId, event.url)
      dispatch(setTabIsLoading({ id: tabId, isLoading: true }))
    },
    // eslint-disable-next-line
    onLoadStop: async (tabId: string, event: any) => {
      console.log('loaded', event.url)
      API.setUrl(tabId, event.url)
      dispatch(setTabIsLoading({ id: tabId, isLoading: false }))
    },
    onClick: (_: string, x: number, y: number) => {
      console.log('click', x, y)
      let e: HTMLElement = document.elementFromPoint(x, y) as HTMLElement
      // SVG doesn't have 'click'
      while (e && !e.click) e = e.parentNode as HTMLElement
      console.log('click on ', e)
      if (e && e.click) e.click()
    },
    onBlank: async (tabId: string, url: string) => {
      const tab = getTabAny(tabId)
      console.log('onBlank', tabId, tab?.url, url)
      // some special scheme?
      if (await handleCustomUrl(url, tab)) return
      // new tab coming, hide current one
      if (tab) await hide(tab.id)
      // just open another tab
      openBlank({ url }, { replace: false })
    },
    onBeforeLoad: async (tabId: string, url: string) => {
      const tab = getTabAny(tabId)
      console.log('onBeforeLoad', tabId, tab?.url, url)
      // intercept lightning: and nostr: links
      return await handleCustomUrl(url, tab)
    },
    onIcon: async (tabId: string, icon: string) => {
      setTabIcon({ id: tabId, icon })

      const tab = getTabAny(tabId)
      if (tab) {
        dbi.updateTab({ ...tab, icon })
      }
    }
  }

  // looks like it depends on every other thing here,
  // so we just rebuild it on every re-render
  browser.setAPI(API)

  return {
    openApp,
    onStopLoadTab,
    onReloadTab,
    onSwitchTab,
    onHideTabInBrowser,
    onCloseTab,
    openTabWindow,
    openBlank,
    replyCurrentPermRequest,
    deletePermission,
    onCloseTabs,
    sendTabPayment,
    backToLastPage
  }
}
