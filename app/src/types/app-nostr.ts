import { APP_NOSTR_SIZE } from '@/consts'
import { OverridableStringUnion } from './utility'
import { AppUrl } from '@/modules/nostr'

export type AppNostr = {
  author?: Record<string, unknown>
  naddr?: string
  url: string
  picture: string
  about?: string
  name: string
  pinned?: boolean
  kinds?: number[]
  order: number
  urls?: AppUrl[]
}

export interface IOpenAppNostr extends AppNostr {
  kind?: string
  lastUsed?: boolean
}

export type AppNostrSizeUnion = (typeof APP_NOSTR_SIZE)[keyof typeof APP_NOSTR_SIZE]

export type AppNostrSize = OverridableStringUnion<AppNostrSizeUnion>
