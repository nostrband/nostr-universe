// export interface SuggestedProfile {
//   pubkey: string
//   relays: string[]
//   profile: {
//     id: string
//     pubkey: string
//     created_at: number
//     kind: number
//     tags: string[]
//     content: string
//     sig: string
//   }
// }

interface Profile {
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
  pubkey: string
  npub: string
}

export interface SuggestedProfile {
  id: string
  pubkey: string
  content: string
  sig: string
  kind: number
  created_at: number
  tags: string[][]
  order: number
  identifier: string
  profile: Profile
}

export type ReturnTypeSuggestedProfiles = SuggestedProfile[]
