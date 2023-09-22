import { IPerm } from './permission-req'

export interface ITab {
  id: string
  url: string
  appNaddr: string
  title: string
  icon: string
  order: number
  pubkey: string
  pinned: string
  screenshot?: string
}

export interface ITabGroup {
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
}

export type WorkSpace = {
  pubkey?: string
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
  tabGroups: ITabGroup[]
  lastKindApps: {
    [key: string]: string
  }
  currentTabId?: string
  perms: IPerm[]
}
