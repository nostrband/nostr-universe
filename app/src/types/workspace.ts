import { ITrendingProfiles } from './trending-profiles'

export type WorkSpace = {
  pubkey: string
  trendingProfiles: ITrendingProfiles
  tabs: {
    id: string
    url: string
    appNaddr: string
    title: string
    icon: string
    order: number
    pubkey: string
    pinned: string
  }[]
  pins: {
    id: string
    url: string
    appNaddr: string
    title: string
    icon: string
    order: number
    pubkey: string
  }[]
  currentTabId: string
  lastCurrentTabId: string
}
