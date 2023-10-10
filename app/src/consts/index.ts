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
  '3': 'Contact List',
  '4': 'Direct Message',
  '5': 'Deletion Request',
  '6': 'Repost',
  '7': 'Reaction',
  '8': 'Badge award',
  '16': 'Generic Repost',
  '40': 'Channel Creation',
  '41': 'Channel Metadata',
  '42': 'Channel Message',
  '43': 'Channel Hide Message',
  '44': 'Channel Mute User',
  '1063': 'File Metadata',
  '1311': 'Live Chat Message',
  '1984': 'Report',
  '1985': 'Label',
  '4550': 'Community Post Approval',
  '9041': 'Zap Goal',
  '9734': 'Zap Request',
  '9735': 'Zap',
  '9802': 'Highlight',
  '10000': 'Mute List',
  '10001': 'Pin List',
  '10002': 'Relay List Info',
  '13194': 'Wallet Info',
  '22242': 'Client Authentication',
  '23194': 'Wallet Request',
  '23195': 'Wallet Response',
  '24133': 'Nostr Connect',
  '27235': 'HTTP Authentication',
  '30000': 'Profile List',
  '30001': 'Bookmark List',
  '30008': 'Profile Badges',
  '30009': 'Badge Definition',
  '30017': 'Stall',
  '30018': 'Product',
  '30023': 'Long Note',
  '30024': 'Long Note Draft',
  '30078': 'Application-specific Data',
  '30311': 'Live Event',
  '30315': 'User Status',
  '30402': 'Classified Listing',
  '30403': 'Classified Listing Draft',
  '31922': 'Date-Based Calendar Event',
  '31923': 'Time-Based Calendar Event',
  '31924': 'Calendar',
  '31925': 'Calendar Event RSVP',
  '31989': 'Used Application List',
  '31990': 'Application',
  '31337': 'Audio Track',
  '34550': 'Community Definition'
}

export interface KindOptionType {
  label: string
  kind: string
}

export const getTransformedKindEvents: KindOptionType[] = Object.entries(kindEvents).map(([key, value]) => ({
  label: value,
  kind: key
}))

export const formatDateHours = 'dd.MM.yyyy HH:mm:ss'
export const formatDate = 'dd.MM.yyyy'
