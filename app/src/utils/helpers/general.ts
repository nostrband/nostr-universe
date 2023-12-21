/* eslint-disable */
// @ts-nocheck
import { MetaEvent } from '@/types/meta-event'
import { nip19 } from '@nostrband/nostr-tools'
import { isGuest } from './prepare-data'

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

export const getSlug = (slugs: string[], curSlug: string) => ({
  isOpen: Boolean(slugs.find((slug) => slug.includes(curSlug))),
  order: slugs.findIndex((slug) => slug.includes(curSlug)) + 1,
  slug: slugs.find((slug) => slug.includes(curSlug))
})

export const getOrderSlug = (slugs: string[], curSlug: string) => slugs.findIndex((slug) => slug.includes(curSlug))

export const getValuePageSlug = (slugs: string[]) => {
  const slug = slugs.find((slug) => slug.includes('?page=')) as string

  const startIndex = slug.indexOf('=') + 1

  return slug.substring(startIndex)
}

export const getSearchParams = (str: string | undefined, name: string): string => {
  if (str) {
    const params = new URLSearchParams(str)

    if (params.get(name)) {
      return params.get(name)
    }

    return ''
  }

  return ''
}
