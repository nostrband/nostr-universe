import { expose } from 'comlink'
import { pauseSync, resumeSync, startSync, resync as resyncMethod } from '@/modules/sync.ts'
import { connect } from '@/modules/nostr.ts'

export interface SyncWorkerAPI {
  start(pubkey: string): void
  resync(pubkey: string): void
  pause(): void
  resume(): void
}

const api: SyncWorkerAPI = {
  start(pubkey: string) {
    startSync(pubkey)
  },
  resync(pubkey: string) {
    connect().then(() => {
      resyncMethod(pubkey)
    })
  },
  pause() {
    pauseSync()
  },
  resume() {
    resumeSync()
  }
}

expose(api)
