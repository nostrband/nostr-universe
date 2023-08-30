export type ReturnContactProfileType = {
  id?: string
  pubkey: string
  kind?: number
  tags?: string[]
  created_at?: number
  content?: string
  profile: {
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
    order?: number
  }
}

export interface IContactList {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: [string, string][]
  content: string
  identifier: string
  order: number
  contactPubkeys: string[]
  contactEvents: ReturnContactProfileType[]
}

export type ReturnTypeContactList = IContactList | null

export type ReturnTypeHighlight = {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: [string, string][]
  content: string
  identifier: string
  order: number
  author: {
    id: string
    pubkey: string
    created_at: number
    kind: number
    tags: [string, string][]
    content: string
    identifier: string
    order: number
    profile: {
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
      damus_donation: number
      banner: string
    }
  }
}

export type ReturnTypeHighlights = ReturnTypeHighlight[] | null
