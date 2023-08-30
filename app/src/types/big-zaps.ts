export interface BigZap {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  identifier: string
  order: number
  description: Description
  bolt11: Bolt11
  amountMsat: number
  targetEventId: string
  targetAddr: string
  targetPubkey: string
  providerPubkey: string
  senderPubkey: string
  targetEvent: TargetEvent
  targetMeta: TargetMeta
  providerMeta: ProviderMeta
  senderMeta: SenderMeta
}

export interface Description {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

export interface Bolt11 {
  paymentRequest: string
  sections: Section[]
  expiry: number
  route_hints: string[]
}

export interface Section {
  name: string
  letters: string
  value: string
  tag?: string
}

export interface TargetEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  identifier: string
  order: number
}

export interface TargetMeta {
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
  banner: string
  website: string
  lud06: string
  nip05: string
  lud16: string
  picture: string
  display_name: string
  about: string
  name: string
  displayName: string
  pubkey: string
  npub: string
  created_at: number
}

export interface ProviderMeta {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[]
  content: string
  identifier: string
  order: number
  profile: Profile2
}

export interface Profile2 {
  name: string
  display_name: string
  about: string
  website: string
  nip05: string
  lud16: string
  pubkey: string
  npub: string
}

export interface SenderMeta {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[]
  content: string
  identifier: string
  order: number
  profile: Profile3
}

export interface Profile3 {
  name: string
  about: string
  nip05: string
  lud06: string
  lud16: string
  picture: string
  display_name: string
  pubkey: string
  npub: string
}

export type ReturnTypeBigZaps = BigZap[] | null
