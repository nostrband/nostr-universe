export interface Communitie {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  identifier: string
  order: number
  author: Author
  name: string
  description: string
  image: string
  moderators: string[]
  last_post_tm: number
  posts: number
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
  reactions: boolean
  about: string
  picture: string
  damus_donation_v2: number
  banner: string
  nip05: string
  lud16: string
  username: string
  display_name: string
  website: string
  lud06: string
  displayName: string
  name: string
  pubkey: string
  npub: string
}

export type ReturnTypeCommunities = Communitie[] | null
