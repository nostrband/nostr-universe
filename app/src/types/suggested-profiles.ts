export interface ReturnTypeSuggestedProfile {
  pubkey: string
  relays: string[]
  profile: Profile
}

export interface Profile {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[]
  content: string
  sig: string
}

export interface SuggestedProfile {
  banner: string
  website: string
  lud16: string
  nip05: string
  picture: string
  display_name: string
  about: string
  name: string
  username: string
  displayName: string
  lud06: string
  npub: string
  pubkey: string
}

export type SuggestedProfiles = SuggestedProfile[] | undefined
export type ReturnTypeSuggestedProfiles = ReturnTypeSuggestedProfile[]
