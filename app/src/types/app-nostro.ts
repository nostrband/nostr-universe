import { APP_NOSTRO_SIZE } from '@/consts'
import { OverridableStringUnion } from './utility'

export type AppNostro = {
  autor?: Record<string, unknown>
  naddr: string
  url: string
  picture: string
  about?: string
  name: string
  pinned?: boolean
  kinds?: number[]
  order: number
  handlers?: {
    [key: string]: {
      url: string
      type: string
    }
  }
}

export interface IOpenAppNostro extends AppNostro {
  kind?: string
  replace?: boolean
  lastUsed?: boolean
}

export type AppNostroSizeUnion = (typeof APP_NOSTRO_SIZE)[keyof typeof APP_NOSTRO_SIZE]

export type AppNostroSize = OverridableStringUnion<AppNostroSizeUnion>
