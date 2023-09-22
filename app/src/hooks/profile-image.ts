import { useEffect, useState } from 'react'
import { isGuest } from '@/utils/helpers/prepare-data'

const MEDIA_NOSTR_BAND_BASE_URL = 'https://media.nostr.band/thumbs'

const getPubkeyLast4Chars = (pubkey: string) => {
  if (pubkey.length >= 4) return pubkey.slice(-4)
  return pubkey
}

export const useProfileImageSource = ({
  pubkey,
  originalImage = '',
  mediaType = 'picture',
  size = 64
}: {
  pubkey: string
  originalImage?: string
  mediaType?: 'picture' | 'banner'
  size?: 64 | 192
}) => {
  const [isFailed, setIsFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const last4Chars = isGuest(pubkey) ? '' : getPubkeyLast4Chars(pubkey)
  const generatedURL = `${MEDIA_NOSTR_BAND_BASE_URL}/${last4Chars}/${pubkey}-${mediaType}-${size}`
  const defaultUserImage = ''

  useEffect(() => {
    if (!pubkey || !originalImage || isGuest(pubkey)) return

    const image = new Image()
    image.onloadstart = function () {
      setIsLoading(true)
      setIsFailed(false)
    }
    image.onload = function () {
      setIsLoading(false)
      setIsFailed(false)
    }
    image.onerror = function () {
      setIsFailed(true)
      setIsLoading(false)
    }

    image.src = generatedURL
  }, [pubkey, originalImage, generatedURL])

  if (!pubkey || !originalImage || isGuest(pubkey)) {
    return defaultUserImage
  }

  if (isLoading) {
    return defaultUserImage
  }

  if (isFailed) {
    return originalImage
  }

  return generatedURL
}
