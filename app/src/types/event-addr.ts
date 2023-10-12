export interface EventAddr {
  kind?: number
  pubkey?: string
  event_id?: string
  d_tag?: string
  relays?: string[]
  hex: boolean
}
