import { ItemEventMultipurpose } from '@/components/ItemsEventContent/ItemEventMultipurpose/ItemEventMultipurpose'
import { ItemEventProfile } from '@/components/ItemsEventContent/ItemEventProfile/ItemEventProfile'
import { getTagValue } from '@/modules/nostr'
import { AuthoredEvent } from '@/types/authored-event'

export const getPreviewComponentEvent = (eventCurrent: AuthoredEvent | null) => {
  if (eventCurrent) {
    switch (eventCurrent.kind) {
      case 0: {
        const profileEvent = {
          author: eventCurrent.author,
          pubkey: eventCurrent.pubkey,
          content: eventCurrent.author?.profile?.about,
          website: eventCurrent.author?.profile?.website,
          kind: eventCurrent.kind
        }

        return <ItemEventProfile event={profileEvent} />
      }

      case 1: {
        const postEvent = {
          author: eventCurrent.author,
          pubkey: eventCurrent.pubkey,
          time: eventCurrent.created_at,
          content: eventCurrent.content,
          kind: eventCurrent.kind
        }

        return <ItemEventMultipurpose event={postEvent} />
      }

      default: {
        const defaultEvent = {
          author: eventCurrent.author,
          pubkey: eventCurrent.pubkey,
          time: eventCurrent.created_at,
          kind: eventCurrent.kind,
          content:
            getTagValue(eventCurrent, 'summary') ||
            getTagValue(eventCurrent, 'description') ||
            getTagValue(eventCurrent, 'alt') ||
            eventCurrent.content,
          title: getTagValue(eventCurrent, 'title') || getTagValue(eventCurrent, 'name')
        }

        return <ItemEventMultipurpose event={defaultEvent} />
      }
    }
  }

  return null
}
