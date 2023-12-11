import { cacheRelayHostname } from './const/relays'
import { LocalRelayClient } from './relay'

class LocalRelayWebSocket extends EventTarget {
  closed: boolean = false
  binaryType: 'blob' | 'arrayBuffer' = 'blob'
  onopen: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  relay: LocalRelayClient

  constructor(url: string) {
    super()

    // eslint-disable-next-line
    this.relay = new LocalRelayClient((msg: any) => {
      this.reply(msg)
    })

    // eslint-disable-next-line
    const self = this
    Object.defineProperty(this, 'bufferedAmount', {
      value: 0
    })
    Object.defineProperty(this, 'extensions', {
      value: ''
    })
    Object.defineProperty(this, 'protocol', {
      value: ''
    })
    Object.defineProperty(this, 'readyState', {
      get: function () {
        return self.closed ? 3 : 1 // CLOSED / OPEN
      }
    })
    Object.defineProperty(this, 'url', {
      value: url
    })
    Object.defineProperty(this, 'url', {
      value: url
    })

    // call onopen on next cycle
    setTimeout(() => {
      if (this.closed) return
      if (this.onopen) this.onopen(new Event('open'))
      this.dispatchEvent(new Event('open'))
    }, 0)
  }

  // eslint-disable-next-line
  reply(obj: any) {
    const str = JSON.stringify(obj)
    if (this.onmessage)
      this.onmessage(
        new MessageEvent('message', {
          data: str
        })
      )
    this.dispatchEvent(
      new MessageEvent('message', {
        data: str
      })
    )
  }

  send(data: string) {
    if (this.closed || typeof data !== 'string') return
    this.relay.handle(data)
  }

  close() {
    if (this.closed) return
    this.closed = true
    if (this.onclose) this.onclose(new CloseEvent('close', { wasClean: true }))
    this.dispatchEvent(new CloseEvent('close', { wasClean: true }))
    this.relay.cleanup()
  }
}

export function overrideWebSocket() {
  // const Src = window.WebSocket
  const cont = typeof window !== 'undefined' ? window : self
  const Src = cont.WebSocket

  // eslint-disable-next-line
  // @ts-ignore
  // NOTE: must be a 'function() {}', not '() => {}'
  // eslint-disable-next-line
  cont.WebSocket = function (url: string | URL, protocols: any) {
    try {
      const u = new URL(url)
      if (u.hostname === cacheRelayHostname) {
        return new LocalRelayWebSocket(u.toString())
      }
    } catch {
      // empty
    }
    return new Src(url, protocols)
  }
}
