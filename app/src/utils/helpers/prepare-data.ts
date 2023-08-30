import { ReturnProfileType } from '@/types/profile'
import { nip19 } from '@nostrband/nostr-tools'

export const getNpub = (key: string) => {
  return nip19.npubEncode(key)
}

export const isGuest = (pubkey: string) => {
  return pubkey.length != 64
}

export const cropName = (s: string, n: number) => {
  if (s.length > n) {
    const newName = s.substring(0, n - 1).trim()
    return `${newName}...`
  }
  return s.trim()
}

export const getShortenText = (str: string) => {
  return `${str.substring(0, 10)}...${str.substring(59)}`
}

export const getProfileImage = (profile: ReturnProfileType | null) => {
  if (profile?.profile) {
    return profile.profile.picture
  }

  return ''
}

export const getProfileName = (profile: ReturnProfileType | null) => {
  const getNameFromKey = (key: string) => (isGuest(key) ? 'Guest' : getShortenText(getNpub(key)))

  if (profile?.profile) {
    return profile.profile.display_name || profile.profile.name || getNameFromKey(profile.pubkey)
  }

  if (profile?.pubkey) {
    return getNameFromKey(profile.pubkey)
  }

  return 'Guest'
}

export const formatTime = (tm: number) => {
  let o = Date.now() / 1000 - tm

  const future = o < 0

  o = Math.abs(o)

  let s = Math.round(o) + 's'
  o = o / 60
  if (o >= 1.0) s = Math.round(o) + 'm'
  o /= 60
  if (o >= 1.0) s = Math.round(o) + 'h'
  o /= 24
  if (o >= 1.0) s = Math.round(o) + 'd'

  return (future ? '+' : '') + s
}
