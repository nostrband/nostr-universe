import { IPerm } from './permission-req'
import { ITrendingProfiles } from './trending-profiles'

export interface ITab {
  id: string
  url: string
  appNaddr: string
  title: string
  icon: string
  order: number
  pubkey: string
  pinned: string
}

export type WorkSpace = {
  pubkey?: string
  trendingProfiles?: ITrendingProfiles
  tabs: ITab[]
  pins: {
    id: string
    url: string
    appNaddr: string
    title: string
    icon: string
    order: number
    pubkey: string
  }[]
  trendingNotes?: string[]
  longNotes?: string[]
  liveEvents?: string[]
  suggestedProfiles?: string[]
  tabGroups: {
    id: string
    info: {
      id: string
      url: string
      appNaddr: string
      title: string
      icon: string
      order: number
      pubkey: string
    }
    tabs: string[]
    pin: {
      id: string
      url: string
      appNaddr: string
      title: string
      icon: string
      order: number
      pubkey: string
    }
    lastTabId: string
    lastActive: number
    order: number
  }[]
  lastKindApps?: {
    [key: string]: string
  }
  currentTabId?: string
  lastCurrentTabId?: string
  perms: IPerm[]
}
