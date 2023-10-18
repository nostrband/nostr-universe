import { keystore } from '@/modules/keystore'
import { nsbDecrypt, nsbEncrypt, nsbSignEvent } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NostrEvent } from '@nostrband/ndk'
import { useCallback } from 'react'

export const useSigner = () => {
  const { currentPubkey, nsbKeys } = useAppSelector((state) => state.keys)

  const signEvent = useCallback(
    async (event: NostrEvent, pubkey?: string) => {
      if (!pubkey) pubkey = currentPubkey
      if (nsbKeys.includes(pubkey)) return await nsbSignEvent(pubkey, event)
      else return await keystore.signEvent(event)
    },
    [currentPubkey, nsbKeys]
  )

  const encrypt = useCallback(
    async (content: string, targetPubkey: string, pubkey?: string) => {
      if (!pubkey) pubkey = currentPubkey
      if (nsbKeys.includes(pubkey)) return await nsbEncrypt(pubkey, content, targetPubkey)
      else return await keystore.encrypt(targetPubkey, content)
    },
    [currentPubkey, nsbKeys]
  )

  const decrypt = useCallback(
    async (content: string, sourcePubkey: string, pubkey?: string) => {
      if (!pubkey) pubkey = currentPubkey
      if (nsbKeys.includes(pubkey)) return await nsbDecrypt(pubkey, content, sourcePubkey)
      else return await keystore.decrypt(sourcePubkey, content)
    },
    [currentPubkey, nsbKeys]
  )

  return {
    signEvent,
    encrypt,
    decrypt
  }
}
