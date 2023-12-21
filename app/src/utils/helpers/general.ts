/* eslint-disable */
// @ts-nocheck
import { MetaEvent } from '@/types/meta-event'
import { nip19 } from '@nostrband/nostr-tools'
import { isGuest } from './prepare-data'
import { RootState } from '@/store/store.ts'

export const getShortenText = (str) => {
  const string = String(str)
  return `${string.substring(0, 10)}...${string.substring(59)}`
}

export const getNpub = (key) => {
  return nip19.npubEncode(key)
}

export const getNoteId = (key) => {
  return nip19.noteEncode(key)
}

export const getRenderedUsername = (profile, pubkey) => {
  return (
    profile?.profile?.display_name ||
    profile?.profile?.name ||
    (isGuest(pubkey) ? 'Guest' : getShortenText(getNpub(pubkey)))
  )
}

export const renderDefaultAppIcon = (title) => {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128

  const ctx = canvas.getContext('2d')

  // background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // text
  ctx.font = 'bold 92px Outfit'
  ctx.fillStyle = 'purple'
  ctx.fillText(title.substring(0, 1).toUpperCase(), 32, 95)
  const dataURL = canvas.toDataURL()
  return dataURL
}

export const checkIsCurrentUser = (pubkey: string, account: MetaEvent | null) => {
  if (account && account?.pubkey) {
    return pubkey === account.pubkey
  }
  return false
}

export const showToast = (message: string) => {
  try {
    // eslint-disable-next-line
    // @ts-ignore
    window.plugins.toast.showShortBottom(message)
  } catch {
    console.log('Show toast failed')
  }
}

export const getSlug = (store: RootState, curSlug: string) => {
  const url = new URLSearchParams(store.router.url)

  for (const key of url.keys()) {
    const value = url.get(key) as string
    url.set(key, value)

    if (value === curSlug) {
      return true
    }
  }

  return false
}
