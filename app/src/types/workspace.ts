import { IContentFeedSetting } from './content-feed'
import { IPerm } from './permission-req'
import { AppNostr } from './app-nostr'

export interface IPin {
  id: string
  url: string
  appNaddr?: string
  title: string
  icon: string
  order: number
  pubkey: string
  groupName?: string
}

export type WorkSpace = {
  pubkey?: string
  tabIds: string[]
  pins: IPin[]
  lastKindApps: {
    [key: string]: AppNostr
  }
  currentTabId?: string
  perms: IPerm[]
  contentFeedSettings: IContentFeedSetting[]
}
