/* eslint-disable */
// @ts-nocheck
let API = {}

const setAPI = (a) => (API = a)

const refs = {}
const infos = {}

const freeRefs = []
const MAX_REFS = 5

function goToUrl(url) {
  window.history.replaceState({}, null, url)
  window.location.reload()
}

const destroy = async (id, idle) => {
  console.log('destroy tab', id, 'idle', idle)

  // delete from refs first
  const ref = refs[id]
  delete refs[id]

  if (!idle) delete infos[id]

  // wait until we release resources
  if (ref) {
    ref.info.released = true
    await ref.navigate('about:blank')

    // add to info list
    freeRefs.push(ref)
  }
}

const releaseIdle = () => {
  console.log('infos ', Object.keys(infos).length)
  console.log('refs ', Object.keys(refs).length)
  console.log('freeRefs ', freeRefs.length)

  // sort tabs by lastActive and canRelease
  const tabs = Object.values(refs)
  tabs.sort((ra, rb) => {
    const a = ra.info
    const b = rb.info
    if (a.canRelease === b.canRelease)
      // desc by time
      return b.lastActiveTime - a.lastActiveTime
    else return a.canRelease ? -1 : 1
  })
  console.log(
    'releaseIdle tabs',
    JSON.stringify(
      tabs.map((t) => ({
        id: t.id,
        url: t.info.url,
        lastActiveTime: t.info.lastActiveTime,
        canRelease: t.info.canRelease
      }))
    )
  )

  // release active tabs that can/should be released
  while (tabs.length > 0) {
    const ref = tabs.shift()
    if (ref.info.canRelease || tabs.length > MAX_REFS) {
      destroy(ref.id, /* idle */ true)
    }
  }

  // drop freeRef tabs if there are too many
  while (freeRefs.length > 0 && tabs.length + freeRefs.length > MAX_REFS * 2) {
    const ref = freeRefs.shift()
    console.log('close released tab', ref.id)
    ref.close()
  }

  // schedule next gc cycle
  setTimeout(releaseIdle, 3000)
}

// launch GC
releaseIdle()

const initTab = () => {
  // this code will be executed in the opened tab,
  // should only refer to local vars bcs it will be
  // sent to the tab as a string, thus functions
  // are declared inline below

  const initWindowNostr = () => {
    window.nostrCordovaPlugin = { requests: {} }
    const _call = function (method, ...params) {
      const id = Date.now().toString()
      window.nostrCordovaPlugin.requests[id] = {}
      return new Promise(function (ok, err) {
        window.nostrCordovaPlugin.requests[id] = { res: ok, rej: err }
        const msg = JSON.stringify({ method, id, params: [...params] })
        console.log('iab sending req ', id, 'method', method, 'msg', msg, 'webkit', window.webkit)
        window.webkit.messageHandlers.cordova_iab.postMessage(msg)
      })
    }
    const _gen = function (method) {
      return function (...a) {
        return _call(method, ...a)
      }
    }

    const nostrKey = {
      getPublicKey: _gen('getPublicKey'),
      signEvent: _gen('signEvent'),
      nip04: {
        encrypt: _gen('encrypt'),
        decrypt: _gen('decrypt')
      }
    }

    // NIP-07 API
    window.nostr = nostrKey

    const weblnKey = {
      sendPayment: _gen('sendPayment'),
      getInfo: _gen('getWalletInfo'),
      enable: (): Promise<void> => {
        return Promise.resolve(undefined)
      }
    }

    // for NIP-47 NWC
    window.webln = weblnKey

    if (!window.navigator) window.navigator = {}

    if (!navigator.clipboard) navigator.clipboard = {}

    // override with out own implementation
    navigator.clipboard.writeText = async (text) => {
      if (window.nostrCordovaPlugin.onClipboardWriteText) {
        try {
          window.nostrCordovaPlugin.onClipboardWriteText(text)
        } catch (e) {
          console.log('error', e)
        }
      }
      return await window.nostrCordovaPlugin.clipboardWriteText(text)
    }
    navigator.clipboard.readText = async () => {
      return await window.nostrCordovaPlugin.clipboardReadText()
    }

    navigator.canShare = () => true
    navigator.share = async (data) => {
      return await window.nostrCordovaPlugin.share(data)
    }

    window.nostrCordovaPlugin.setUrl = _gen('setUrl')
    window.nostrCordovaPlugin.showContextMenu = _gen('showContextMenu')
    window.nostrCordovaPlugin.decodeBech32 = _gen('decodeBech32')
    window.nostrCordovaPlugin.clipboardWriteText = _gen('clipboardWriteText')
    window.nostrCordovaPlugin.clipboardReadText = _gen('clipboardReadText')
    window.nostrCordovaPlugin.share = _gen('share')

    // for some clients that expect this
    setTimeout(() => {
      document.dispatchEvent(new Event('webln:ready'))
    }, 0)
  }

  const initUrlChange = () => {
    // popstate event doesn't work for history.pushState which most SPAs use
    const body = document.querySelector('body')
    let oldHref = document.location.href
    const observer = new MutationObserver((mutations) => {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href
        console.log('url change', document.location.href)
        window.nostrCordovaPlugin.setUrl(document.location.href)
      }
    })
    observer.observe(body, { childList: true, subtree: true })
  }

  initWindowNostr()
  initUrlChange()
}

// executed in the tab
const nostrMenuConnect = () => {
  const getBech32 = async (value) => {
    if (!value) return ''
    // limit prefixes to small ascii chars
    const BECH32_REGEX = /[a-z]{1,10}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/g

    const array = [...value.matchAll(BECH32_REGEX)].map((a) => a[0])

    let bech32 = ''
    for (let b32 of array) {
      try {
        const { type, data } = await window.nostrCordovaPlugin.decodeBech32(b32)
        console.log('b32', b32, 'type', type, 'data', data)
        switch (type) {
          case 'npub':
          case 'nprofile':
          case 'note':
          case 'nevent':
          case 'naddr':
          case 'lnbc':
            bech32 = b32
            break
        }
      } catch (e) {
        console.log('bad b32', b32, 'e', e)
      }

      if (bech32) break
    }

    return bech32
  }

  const getAttrBech32 = async (e, attrName) => {
    const value = e.getAttribute(attrName)
    console.log('attr', attrName, 'value', value)
    return await getBech32(value)
  }

  const getAbsUrl = (s) => {
    if (!s) return ''
    try {
      const url = new URL(s, document.location)
      return url.toString()
    } catch {
      return ''
    }
  }

  const getMaybeUrl = (s) => {
    try {
      const url = new URL(text)
      if (url.origin) return url.toString()
    } catch {}
    return ''
  }

  const showMenu = async (data) => {
    const hasData = Object.keys(data).some((i) => !!data[i])
    if (!hasData) return

    console.log('show menu', JSON.stringify(data))

    function clear() {
      window.nostrCordovaPlugin.magicMenu?.remove()
      window.nostrCordovaPlugin.magicMenu = null
    }

    // clear previous menu, if any
    const reopen = !!window.nostrCordovaPlugin.magicMenu
    clear()

    const d = document.createElement('div')
    d.style = `
      font-family: sans-serif; 
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      z-index: 1000000;
      border: 1px solid #853093; 
      border-radius: 10px; 
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; 
      position: fixed; 
      top: 16px; 
      left: 50%; 
      transform: translate(-50%, 0); 
      padding: 5px 8px;
      cursor: pointer;

      background-image: linear-gradient(to right, #8d3093 0%, #ff44fb  51%, #853093  100%);
      background-size: 200% auto;
      color: white;
      display: block;
      opacity: ${reopen ? 1 : 0};
      transition: opacity 0.5s linear;
      white-space: nowrap;
    `

    d.innerHTML = `
      <nobr>
        <svg style="vertical-align: middle" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><g><rect fill="none" height="24" width="24" x="0"/></g><g><g><polygon points="20,7 20.94,4.94 23,4 20.94,3.06 20,1 19.06,3.06 17,4 19.06,4.94"/><polygon points="8.5,7 9.44,4.94 11.5,4 9.44,3.06 8.5,1 7.56,3.06 5.5,4 7.56,4.94"/><polygon points="20,12.5 19.06,14.56 17,15.5 19.06,16.44 20,18.5 20.94,16.44 23,15.5 20.94,14.56"/><path d="M17.71,9.12l-2.83-2.83C14.68,6.1,14.43,6,14.17,6c-0.26,0-0.51,0.1-0.71,0.29L2.29,17.46c-0.39,0.39-0.39,1.02,0,1.41 l2.83,2.83C5.32,21.9,5.57,22,5.83,22s0.51-0.1,0.71-0.29l11.17-11.17C18.1,10.15,18.1,9.51,17.71,9.12z M14.17,8.42l1.41,1.41 L14.41,11L13,9.59L14.17,8.42z M5.83,19.59l-1.41-1.41L11.59,11L13,12.41L5.83,19.59z"/></g></g></svg>
        <span style="vertical-align: middle">Magic menu</span>
      </nobr>
    `
    document.body.appendChild(d)

    function isActive() {
      return Object.is(window.nostrCordovaPlugin.magicMenu, d)
    }

    function remove() {
      // since this action happens in the future,
      // we must check if a newer menu was already created
      if (!isActive()) return
      d.style.opacity = '0'
      setTimeout(() => {
        if (isActive()) clear()
      }, 3000)
    }

    function onClick(e) {
      remove()
      document.body.removeEventListener('click', onClick)
    }

    d.addEventListener('click', (e) => {
      if (isActive()) window.nostrCordovaPlugin.showContextMenu(data)
      e.stopPropagation()
      document.body.removeEventListener('click', onClick)
      remove()
    })

    document.body.addEventListener('click', onClick)

    window.nostrCordovaPlugin.magicMenu = d
    setTimeout(() => {
      if (isActive()) d.style.opacity = '1'
    }, 0)

    // start watching text selection and
    // show another menu if selection changes
    const selectionMonitor = async () => {
      if (!isActive()) return

      const sel = window.getSelection().toString()
      if (data.text !== sel) {
        data.text = sel
        data.bech32 = await getBech32(sel)
        data.href = getMaybeUrl(sel)
        showMenu(data)
        return
      }

      setTimeout(selectionMonitor, 200)
    }

    selectionMonitor()
  }

  window.nostrCordovaPlugin.onClipboardWriteText = async (text) => {
    console.log('onClipboardWriteText', text)
    const data = {
      text,
      bech32: await getBech32(text),
      href: getMaybeUrl(text)
    }

    showMenu(data)
  }

  let onlongtouch = null
  let timer = null
  let touchduration = 1000 // length of time we want the user to touch before we do something
  let touchX = 0
  let touchY = 0
  let curX = 0
  let curY = 0

  const isLongTouch = () => {
    return Math.abs(curX - touchX) < 20 && Math.abs(curY - touchY) < 20
  }

  const touchStart = (e) => {
    // Error: unable to preventdefault inside passive event listener due to target being treated as passive
    //  e.preventDefault();

    const touch = e.touches?.item(0) || e
    if (!timer) {
      touchX = touch.screenX
      touchY = touch.screenY

      timer = setTimeout(() => {
        timer = null
        if (isLongTouch()) onLongTouch(e)
      }, touchduration)
    }
  }

  const touchMove = (e) => {
    const touch = e.touches?.item(0) || e
    curX = touch.screenX
    curY = touch.screenY
    if (timer && !isLongTouch()) touchEnd()
  }

  const touchEnd = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  onLongTouch = async (e) => {
    const t = e.target
    console.log('longtouch', t)
    try {
      const data = {
        bech32: '',
        text: ''
      }

      // text selection is a priority
      const sel = window.getSelection().toString()
      data.text = sel
      data.bech32 = await getBech32(sel)
      data.href = getMaybeUrl(sel)

      if (!data.href) data.href = getAbsUrl(t.getAttribute('href')) || ''

      data.imgSrc = t.tagName === 'IMG' ? getAbsUrl(t.getAttribute('src')) : ''
      data.videoSrc = t.tagName === 'VIDEO' ? getAbsUrl(t.getAttribute('src')) : ''
      data.audioSrc = t.tagName === 'AUDIO' ? getAbsUrl(t.getAttribute('src')) : ''

      // attrs are next
      if (!data.bech32) {
        data.bech32 =
          (await getAttrBech32(t, 'href')) ||
          (await getAttrBech32(t, 'id')) ||
          (await getAttrBech32(t, 'value')) ||
          (await getAttrBech32(t, 'data-npub')) ||
          (await getAttrBech32(t, 'data-id')) ||
          (await getAttrBech32(t, 'data-note-id'))
      }

      showMenu(data)
    } catch (e) {
      console.log('menu failed', t, e)
    }
  }

  // assume content is already loaded
  window.addEventListener('touchstart', touchStart, false)
  window.addEventListener('touchmove', touchMove, false)
  window.addEventListener('touchend', touchEnd, false)
  window.addEventListener('mousedown', touchStart, false)
  window.addEventListener('mousemove', touchMove, false)
  window.addEventListener('mouseup', touchEnd, false)
}

// get local file by path as string, async
const getAsset = async (path) => {
  return new Promise((ok, err) => {
    const r = new XMLHttpRequest()
    r.open('GET', path, true)
    r.onload = (e) => {
      if (r.readyState === 4) {
        if (r.status === 200) {
          console.log('got asset ', path)
          ok(r.responseText)
        } else {
          err('failed to get asset ' + path + ' r ' + r.statusText)
        }
      }
    }
    r.onerror = (e) => {
      err('failed to get asset ' + path + ' r ' + r.statusText)
    }
    r.send(null)
  })
}

// must not be () => {} form bcs it wont be able to access 'this'
async function executeScriptAsync(code, name) {
  const self = this
  return new Promise((ok, err) => {
    try {
      self.executeScript({ code }, (v) => {
        console.log('injected script', name)
        ok(v)
      })
    } catch (e) {
      console.log('failed to inject script', name)
      err(e)
    }
  })
}

async function executeFuncAsync(name, fn, ...args) {
  const code = `(${fn.toString()})(...${JSON.stringify(args)})`
  console.log('fn', name, 'code', code)
  return this.executeScriptAsync(code, name)
}

function setEventListeners(ref) {
  // helper
  const init = async (r) => {
    // inject our scripts

    // main init to enable comms interface
    await r.executeFuncAsync('initTab', initTab)

    // init context menu
    await r.executeFuncAsync('nostrMenuConnect', nostrMenuConnect)
  }

  ref.addEventListener('loadstart', async (event) => {
    console.log('loadstart ', event.url, 'released', JSON.stringify(ref))
    if (ref.info.released) return
    if (ref.info.state === 'starting') return

    ref.info.state = 'starting'
    if (API.onLoadStart) await API.onLoadStart(ref.info.apiCtx, event)
  })

  ref.addEventListener('loadinit', async (event) => {
    if (ref.info.released || event.url === 'about:blank') return
    console.log('loadinit', event.url)
    if (ref.info.state === 'init') return
    ref.info.state = 'init'
    ref.info.url = event.url
    await init(ref)
  })

  ref.addEventListener('loadstop', async (event) => {
    if (ref.info.released) return
    if (ref.info.state !== 'init') {
      ref.info.state = 'init'
      await init(ref)
    }

    // after everything is done
    if (API.onLoadStop) await API.onLoadStop(ref.info.apiCtx, event)
  })

  // handle api requests
  ref.addEventListener('message', async (msg) => {
    if (ref.info.released) return
    // console.log("got iab message", JSON.stringify(msg));
    const id = msg.data.id.toString()
    const method = msg.data.method
    let target = null
    let targetArgs = msg.data.params
    if (method in API) target = API
    if (ref.info.apiCtx !== undefined) targetArgs = [ref.info.apiCtx, ...targetArgs]

    let err = null
    let reply = null
    if (target) {
      try {
        reply = await target[method](...targetArgs)
      } catch (e) {
        err = `${e}`
      }

      // FIXME remove later when we switch to onboarding
      if (method === 'getPublicKey' && API.onGetPubkey) {
        await API.onGetPubkey(ref.info.apiCtx, reply)
      }
    } else {
      err = `Unknown method ${method}`
    }

    function fn(id, method, jsonReply, err) {
      const req = window.nostrCordovaPlugin.requests[id]
      if (!err) {
        req.res(jsonReply)
      } else {
        req.rej(new Error(err))
      }
      delete window.nostrCordovaPlugin.requests[id]
    }

    const args = [id, method, reply, err]
    await ref.executeFuncAsync('method ' + method, fn, ...args)
  })

  // tab menu, for now just closes the tab
  ref.addEventListener('menu', async () => {
    if (ref.info.released) return
    if (API.onMenu) await API.onMenu(ref.info.apiCtx)
  })

  // tab is hidden
  ref.addEventListener('hide', async () => {
    if (ref.info.released) return
    if (API.onHide) await API.onHide(ref.info.apiCtx)
  })

  // handle clicks outside the inappbrowser to
  // intercept them and forward to our main window
  ref.addEventListener('click', async (event) => {
    if (ref.info.released) return
    const x = event.x / window.devicePixelRatio
    const y = event.y / window.devicePixelRatio
    console.log('browser click', event.x, event.y, ' => ', x, y)
    if (API.onClick) await API.onClick(ref.info.apiCtx, x, y)
  })

  ref.addEventListener('blank', async (event) => {
    if (ref.info.released) return
    if (API.onBlank) await API.onBlank(ref.info.apiCtx, event.url)
  })

  ref.addEventListener('beforeload', async (event, cb) => {
    if (ref.info.released) return
    console.log('beforeload', JSON.stringify(event))
    if (API.onBeforeLoad) {
      // handled by our code?
      if (await API.onBeforeLoad(ref.info.apiCtx, event.url)) return
    }
    cb(event.url)
  })

  ref.addEventListener('icon', async (event) => {
    if (ref.info.released) return
    if (API.onIcon) await API.onIcon(ref.info.apiCtx, event.icon)
  })
}

async function createRef(info) {
  console.log('creating tab', JSON.stringify(info))

  const bottomOffset = 50 - 1
  const bottom = Math.round(window.devicePixelRatio * bottomOffset)
  const loc = 'no' // params.menu ? "no" : "yes";
  const menu = 'no' //params.menu ? 'no' : 'yes'
  const hidden = 'yes' // params.hidden ? 'yes' : 'no'
  const geticon = 'yes' //params.geticon ? 'yes' : 'no'

  const options = `location=${loc},beforeload=yes,beforeblank=yes,fullscreen=no,closebuttonhide=yes,multitab=yes,menubutton=${menu},zoom=no,bottomoffset=${bottom},hidden=${hidden},geticon=${geticon},transparentloading=yes`
  console.log('browser options', options)

  const ref = cordova.InAppBrowser.open(info.url, '_blank', options)
  ref.executeScriptAsync = executeScriptAsync
  ref.executeFuncAsync = executeFuncAsync
  ref.id = info.id
  ref.info = info

  setEventListeners(ref)

  refs[ref.id] = ref
}

// returns ref to the browser window
export async function open(params) {
  if (params.id in refs) {
    console.log('browser ', params.id, 'already opened')
    return
  }

  const info = {
    id: params.id,
    apiCtx: params.apiCtx,
    canRelease: false,
    lastActiveTime: Date.now(),
    shown: false,
    released: false,
    state: '',
    url: params.url
  }
  infos[info.id] = info

  await ensureTab(info.id)
}

const ensureTab = async (id) => {
  if (id in refs) return

  const info = infos[id]
  info.released = false

  if (freeRefs.length > 0) {
    const ref = freeRefs.shift()
    console.log('reuse ref', ref.id, 'url', info.url)
    ref.id = info.id
    ref.info = info
    refs[ref.id] = ref
    await ref.navigate(info.url)
  } else {
    await createRef(info)
  }
}

const show = async (id) => {
  if (!(id in infos)) return
  await ensureTab(id)
  const ref = refs[id]
  ref.info.lastActiveTime = Date.now()
  ref.info.shown = true
  ref.info.canRelease = false
  await ref.show()
}

const hide = async (id) => {
  if (!(id in infos)) return
  const ref = refs[id]
  if (ref) await ref.hide()
  const info = infos[id]
  info.shown = false
}

const stop = async (id) => {
  // ignore if tab is released
  if (!(id in refs)) return
  await refs[id]?.stop()
}

const reload = async (id) => {
  // ignore if tab is released
  if (!(id in refs)) return
  await refs[id]?.reload()
}

const close = async (id) => {
  if (!(id in infos)) return
  destroy(id)
}

const canRelease = (id) => {
  if (!(id in infos)) return

  const info = infos[id]
  info.canRelease = true
}

const screenshot = async (id) => {
  if (!(id in refs)) return

  const info = infos[id]
  info.lastActiveTime = Date.now()

  const ref = refs[id]
  return new Promise((ok) => {
    ref.screenshot(
      (s) => {
        console.log('screenshot', id, s.length)
        ok(s)
      },
      0.4 / window.devicePixelRatio,
      1.0
    )
  })
}

export const browser = {
  open,
  show,
  close,
  hide,
  stop,
  reload,
  screenshot,
  setAPI,
  canRelease
}
