import { IPerm } from './permission-req'

export interface ITab {
  id: string
  url: string
  appNaddr: string
  title: string
  icon: string
  order: number
  pubkey: string
  pinned: boolean
  screenshot?: string
}

export interface ITabGroup {
  id: string,
  tabs: ITab[],
}

export interface IPin {
  id: string
  url: string
  appNaddr: string
  title: string
  icon: string
  order: number
  pubkey: string
}

export type WorkSpace = {
  pubkey?: string
  tabs: ITab[]
  pins: IPin[]
  lastKindApps: {
    [key: string]: string
  }
  currentTabId?: string
  perms: IPerm[]
}
