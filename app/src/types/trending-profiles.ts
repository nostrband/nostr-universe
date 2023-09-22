export type TrendingProfile = {
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

export type ReturnTypeTrendingProfiles = TrendingProfile[]
