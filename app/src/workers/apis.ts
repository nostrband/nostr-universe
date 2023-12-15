import {
  NostrEvent
  // eslint-disable-next-line
  // @ts-ignore
} from '@nostrband/ndk'
import { ISyncState } from '@/types/sync-state'

export interface WorkerAPI {
  syncStart(pubkey: string): void
  syncResync(pubkey: string): void
  syncPause(): void
  syncResume(): void
  syncIsPaused(): boolean
  syncSetOnState(cb: (state: ISyncState) => void): void

  relayInitLocal(): void
  relayGetEventsCount(): number
  relayGetEventStats(): { kinds: [number, number][], pubkeys: [number, number][]}
  relayCreateLocalClient(onReply: (msg: any) => void): string
  relayLocalSend(id: string, data: string): void
  relayLocalDestroy(id: string): void
  relayAddLocalEvents(events: NostrEvent[], fromSync?: boolean): boolean[]
}