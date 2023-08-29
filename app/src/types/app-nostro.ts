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
}
