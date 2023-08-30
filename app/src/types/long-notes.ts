export interface LongPost {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  identifier: string
  order: number
  author: Author
  title: string
  summary: string
  published_at: number
}

export interface Author {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[]
  content: string
  identifier: string
  order: number
  profile: Profile
}

export interface Profile {
  name: string
  nip05: string
  about: string
  picture: string
  lud16: string
  pubkey: string
  npub: string
}

export type ReturnTypeLongPosts = LongPost[] | null
