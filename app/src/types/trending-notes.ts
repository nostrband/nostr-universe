export type ReturnNoteType = {
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

export type ReturnTrendingNotes = ReturnNoteType[]

export type TrendingNote = {
  id: string
  kind: string
  pubkey: string
  tags: string[][]
  created_at: number
  content: string
  sig: string
  author: {
    id: string
    kind: string
    pubkey: string
    tags: string[]
    created_at: number
    content: string
    sig: string
    profile: {
      banner: string
      website: string
      nip05: string
      picture: string
      lud16: string
      display_name: string
      about: string
      name: string
    }
  }
}

export type TrendingNotes = TrendingNote[] | undefined
