import { worker } from '@/workers/client'
import { cacheRelayHostname } from './const/relays'
import { proxy } from 'comlink'

class LocalRelayWebSocket extends EventTarget {
  closed: boolean = false
  binaryType: 'blob' | 'arrayBuffer' = 'blob'
  onopen: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  relayId: string = ''

  constructor(url: string) {
    super()

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

    // eslint-disable-next-line
    worker.relayCreateLocalClient(proxy(this.reply.bind(this))).then((id) => {
      this.relayId = id
      if (this.closed) return
      if (this.onopen) this.onopen(new Event('open'))
      this.dispatchEvent(new Event('open'))
    })
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
    worker.relayLocalSend(this.relayId, data)
  }

  close() {
    if (this.closed) return
    this.closed = true
    if (this.onclose) this.onclose(new CloseEvent('close', { wasClean: true }))
    this.dispatchEvent(new CloseEvent('close', { wasClean: true }))
    worker.relayLocalDestroy(this.relayId)
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
        console.log('connect to local', url)
        return new LocalRelayWebSocket(u.toString())
      }
    } catch (e) {
      // empty
      console.log('LocalRelayWebSocket error ', e)
    }
    console.log('connect to remote', url)
    return new Src(url, protocols)
  }
}
