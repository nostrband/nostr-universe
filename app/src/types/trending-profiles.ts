export type ReturnTrendingProfile = {
  pubkey: string
  new_followers_count: number
  relays: string[]
  profile: {
    content: string
    created_at: number
    id: string
    kind: number
    pubkey: string
    sig: string
    tags: string[]
  }
}

export type ReturnTrendingProfiles = ReturnTrendingProfile[]

export type TrendingProfile = {
  name: string
  about: string
  picture: string
  username: string
  display_name: string
  displayName: string
  banner: string
  website: string
  nip05: string
  lud16: string
  lud06: string
  npub: string
  pubkey: string
}

export type ITrendingProfiles = TrendingProfile[]
