import { useEffect, useState } from 'react'
import { isGuest } from '@/utils/helpers/prepare-data'
import { useInView } from 'react-intersection-observer'

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

  const { ref, inView } = useInView({
    threshold: 0
  })

  const last4Chars = isGuest(pubkey) ? '' : getPubkeyLast4Chars(pubkey)
  const generatedURL = `${MEDIA_NOSTR_BAND_BASE_URL}/${last4Chars}/${pubkey}-${mediaType}-${size}`
  const defaultUserImage = ''

  useEffect(() => {
    if (!pubkey || !originalImage || isGuest(pubkey)) return
    if (!inView) return

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
    image.loading = 'lazy'
  }, [pubkey, originalImage, generatedURL, inView])

  const returnedObject = {
    viewRef: ref
  }

  if (!pubkey || !originalImage || isGuest(pubkey)) {
    return { ...returnedObject, url: defaultUserImage }
  }

  if (isLoading) {
    return { ...returnedObject, url: defaultUserImage }
  }

  if (isFailed) {
    return { ...returnedObject, url: originalImage }
  }

  return {
    ...returnedObject,
    url: generatedURL
  }
}
