import { keystore } from '@/modules/keystore'
import { nsbSignEvent } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
// @ts-ignore
import { NostrEvent } from '@nostrband/ndk'
import { useCallback } from 'react'

export const useSignEvent = () => {
  const { currentPubkey, nsbKeys } = useAppSelector((state) => state.keys)

  const signEvent = useCallback(
    async (event: NostrEvent, pubkey?: string) => {
      if (!pubkey) pubkey = currentPubkey
      if (nsbKeys.includes(pubkey)) return await nsbSignEvent(pubkey, event)
      else return await keystore.signEvent(event)
    },
    [currentPubkey, nsbKeys]
  )

  return {
    signEvent
  }
}
