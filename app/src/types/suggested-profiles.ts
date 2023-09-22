export interface SuggestedProfile {
  pubkey: string
  relays: string[]
  profile: {
    id: string
    pubkey: string
    created_at: number
    kind: number
    tags: string[]
    content: string
    sig: string
  }
}

export type ReturnTypeSuggestedProfiles = SuggestedProfile[]
