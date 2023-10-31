import { dbi } from '@/modules/db'
import { keystore } from '@/modules/keystore'
import { nsbDecrypt, nsbEncrypt, nsbSignEvent } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NostrEvent } from '@nostrband/ndk'
import { useCallback } from 'react'
import { sha256 } from '@noble/hashes/sha256'
import { bytesToHex } from '@noble/hashes/utils'
import { v4 } from 'uuid'

export const useSigner = () => {
  const { currentPubkey, nsbKeys } = useAppSelector((state) => state.keys)

  const signEvent = useCallback(
    async (event: NostrEvent, pubkey?: string, url?: string) => {
      if (!pubkey) pubkey = currentPubkey
      const signedEvent = nsbKeys.includes(pubkey) ? await nsbSignEvent(pubkey, event) : await keystore.signEvent(event)

      const eventJson = JSON.stringify(signedEvent)
      console.log('signed', JSON.stringify(eventJson))
      const eventZapHash = bytesToHex(sha256(new TextEncoder().encode(eventJson)))
      console.log('signed event zap hash', eventZapHash)

      // do not wait for it
      dbi.addSignedEvent({
        timestamp: Date.now(),
        kind: signedEvent.kind,
        eventJson: eventJson,
        eventId: signedEvent.id,
        eventZapHash,
        url,
        pubkey,
        id: v4()
      })

      return signedEvent
    },
    [currentPubkey, nsbKeys]
  )

  const encrypt = useCallback(
    async (content: string, targetPubkey: string, pubkey?: string): Promise<string> => {
      if (!pubkey) pubkey = currentPubkey
      if (nsbKeys.includes(pubkey)) return await nsbEncrypt(pubkey, content, targetPubkey)
      else return await keystore.encrypt(targetPubkey, content)
    },
    [currentPubkey, nsbKeys]
  )

  const decrypt = useCallback(
    async (content: string, sourcePubkey: string, pubkey?: string): Promise<string> => {
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
