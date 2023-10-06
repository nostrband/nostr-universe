export const DEFAULT_PUBKEY = 'anon'
export const MIN_ZAP_AMOUNT = 1000
export const EVENT_LIVE_STATUS = 'live'
export const NATIVE_NADDR = 'nativeApp'

export const APP_NOSTR_SIZE = {
  BIG: 'big',
  LARGE: 'large',
  MEDIUM: 'medium',
  SMALL: 'small',
  EXTRA_SMALL: 'extra-small'
} as const

export const kindEvents: { [key: string]: string } = {
  '0': 'Profile',
  '1': 'Note',
  '3': 'Contact list',
  '4': 'DM',
  '6': 'Repost',
  '7': 'Like',
  '8': 'Badge award',
  '1063': 'File metadata',
  '1984': 'Report',
  '9735': 'Zap',
  '9802': 'Highlight',
  '10000': 'Mute list',
  '10001': 'Pin list',
  '13194': 'Wallet info',
  '30000': 'Profile list',
  '30001': 'Bookmark list',
  '30008': 'Profile badges',
  '30009': 'Badge definition',
  '30017': 'Stall',
  '30018': 'Product',
  '30023': 'Long-form post',
  '31989': 'Used apps',
  '31990': 'App handlers',
  '31337': 'Audio track'
}
