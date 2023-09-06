export interface LiveEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  identifier: string
  order: number
  title: string
  summary: string
  starts: number
  current_participants: number
  status: string
  host: string
  members: string[]
  author: Author
  name: string
  description: string
  image: string
  moderators: string[]
  last_post_tm: number
  posts: number
  hostMeta: Meta
  membersMeta: Meta[]
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
  lud16: string
  name: string
  nip05: string
  npub: string
  picture: string
  pubkey: string
  website: string
}

export interface MetaProfile extends Profile {
  banner: string
  nip57: string
  about: string
}

export interface Meta extends Omit<Author, 'profile'> {
  profile: MetaProfile
}

export type ReturnTypeLiveEvents = LiveEvent[] | null
