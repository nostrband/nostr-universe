import { IPerm } from './permission-req'

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
  tabIds: string[]
  pins: IPin[]
  lastKindApps: {
    [key: string]: string
  }
  currentTabId?: string
  perms: IPerm[]
}
