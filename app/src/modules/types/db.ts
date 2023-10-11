import { IOpenAppNostr } from '@/types/app-nostr'
import { IContentFeedSetting } from '@/types/content-feed'
import Dexie from 'dexie'

interface Tab {
  id: number
  pubkey: string
  url: string
  //  appNaddr: string
  order: number
  title: string
  icon: string
}

interface Pin {
  id: number
  pubkey: string
  url: string
  appNaddr: string
  order: number
  title: string
  icon: string
}

interface App {
  naddr: string
  name: string
  picture: string
  url: string
  about: string
}

interface Profile {
  id: string
  pubkey: string
  kind: string
  created_at: number
}

interface LastContact {
  pubkey: string
  contactPubkey: string
  tm: number
}

interface Flag {
  id: number
  pubkey: string
  name: string
  value: string
}

interface ReadOnlyKey {
  pubkey: string
  current: boolean
}

interface NSBKey {
  pubkey: string
  localPubkey: string
  token: string
}

interface Setting {
  id: string
  pubkey: string
  settings_json: IContentFeedSetting[]
}

interface LastKindApps extends IOpenAppNostr {}

export interface SearchHistory {
  id: string
  pubkey: string
  timestamp: number
  value: string
}

export interface DbSchema extends Dexie {
  tabs: Dexie.Table<Tab, number>
  pins: Dexie.Table<Pin, number>
  apps: Dexie.Table<App, number>
  profiles: Dexie.Table<Profile, number>
  lastContacts: Dexie.Table<LastContact, number>
  flags: Dexie.Table<Flag, number>
  readOnlyKeys: Dexie.Table<ReadOnlyKey, number>
  nsecbunkerKeys: Dexie.Table<NSBKey, number>
  contentFeedSettings: Dexie.Table<Setting, number>
  lastKindApps: Dexie.Table<LastKindApps, number>
  searchHistory: Dexie.Table<SearchHistory, number>
}
