import { dbi } from '@/modules/db'
import { getEventNip19 } from '@/modules/nostr'
import { AugmentedEvent } from '@/types/augmented-event'
import { v4 as uuid } from 'uuid'

export const addSearchClickEventToDB = async (e: AugmentedEvent, pubkey: string, query: string) => {
  const addr = getEventNip19(e)
  const searchClickEvent = {
    id: uuid(),
    addr,
    kind: e.kind,
    pubkey,
    query,
    timestamp: Date.now()
  }
  dbi.addSearchClickEvent(searchClickEvent)
}

export const getSearchClickHistoryList = async (pubkey: string) => {
  return dbi.listSearchClickHistory(pubkey)
}
