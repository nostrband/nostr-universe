// This code is launched in a web worker in a separate thread,
// it has no access to window and can import long-running heavy modules

import { expose } from 'comlink'
import * as sync from '@/modules/sync.ts'
import * as relay from '@/modules/relay.ts'
import {
  NostrEvent
  // eslint-disable-next-line
  // @ts-ignore
} from '@nostrband/ndk'
import { ISyncState } from '@/types/sync-state'
import { WorkerAPI } from '@/workers/apis'
import { setOnAddLocalRelayEvents } from '@/modules/nostr'

// @ts-ignore
//declare const self: SharedWorkerGlobalScope;

const api: WorkerAPI = {
  syncStart(pubkey: string) {
    return sync.startSync(pubkey)
  },
  syncResync(pubkey: string) {
    return sync.resync(pubkey)
  },
  syncPause() {
    return sync.pauseSync()
  },
  syncResume() {
    return sync.resumeSync()
  },
  syncIsPaused(): boolean {
    return sync.isSyncPaused()
  },
  syncSetOnState(cb: (state: ISyncState) => void) {
    return sync.setOnSyncState(cb)
  },

  relayInitLocal() {
    return relay.initLocalRelay()
  },
  relayGetEventsCount() {
    return relay.getEventsCount()
  },
  relayGetEventStats() {
    return relay.getEventStats()
  },
  relayCreateLocalClient(onReply: (msg: any) => void) {
    return relay.createLocalRelayClient(onReply)
  },
  relayLocalSend(id: string, data: string) {
    return relay.localRelayHandle(id, data)
  },
  relayLocalDestroy(id: string) {
    return relay.localRelayDestroy(id)
  },
  relayAddLocalEvents(events: NostrEvent[], fromSync?: boolean) {
    return relay.addLocalRelayEvents(events, fromSync)
  }
}

setOnAddLocalRelayEvents(
  (events: any) => Promise.resolve(relay.addLocalRelayEvents(events)))
sync.setAddLocalRelayEvents(
  (es: NostrEvent[]) => Promise.resolve(relay.addLocalRelayEvents(es)))
relay.setOnBeforeNewEvent(
  sync.onBeforeNewEvent)

expose(api)
