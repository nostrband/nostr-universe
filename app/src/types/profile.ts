export type ReturnProfileType = {
  id?: string
  pubkey: string
  kind?: number
  tags?: string[]
  created_at?: number
  content?: string
  profile?: {
    name: string
    picture: string
    about: string
    nip05: string
    lud06: string
    lud16: string
    display_name: string
    website: string
    pubkey: string
    npub: string
  }
}
