import { FeedbackInfo } from "@/types/feedback-info"
import { useSigner } from "./signer"
// @ts-ignore
import { NostrEvent } from '@nostrband/ndk'
import { KIND_DM, publishEvent } from "@/modules/nostr"
import { NOSTR_BAND_PUBKEY } from "@/consts"
import { nip04, generatePrivateKey, getEventHash, getPublicKey, getSignature } from "@nostrband/nostr-tools"

export const useFeedback = () => {
  const { signEvent, encrypt } = useSigner()

  const sendFeedback = async (data: FeedbackInfo) => {

    let event: NostrEvent = {
      content: JSON.stringify(data),
      kind: KIND_DM,
      tags: [
        ['p', NOSTR_BAND_PUBKEY],
        ['t', 'spring-feedback']
      ],
      created_at: Math.ceil(Date.now() / 1000),
    }

    if (data.sendAsUser) {
      event.content = await encrypt(event.content, NOSTR_BAND_PUBKEY)
      event = await signEvent(event)
    } else {
      const sk = generatePrivateKey() // `sk` is a hex string
      event.pubkey = getPublicKey(sk)
      event.content = await nip04.encrypt(sk, NOSTR_BAND_PUBKEY, event.content)
      event.id = getEventHash(event)
      event.sig = getSignature(event, sk)
    }

    console.log("signed feedback", JSON.stringify(event))

    await publishEvent(event)
  }

  return {
    sendFeedback
  }
}