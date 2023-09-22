export type TrendingNote = {
  id: string
  pubkey: string
  relays: string[]
  event: {
    id: string
    kind: string
    pubkey: string
    tags: string[][]
    created_at: number
    content: string
    sig: string
  }
  author: {
    id: string
    kind: string
    pubkey: string
    tags: string[]
    created_at: number
    content: string
    sig: string
  }
}

export type ReturnTypeTrendingNotes = TrendingNote[]
