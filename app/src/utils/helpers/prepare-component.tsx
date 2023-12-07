import { ItemEventCommunitie } from '@/components/ItemsEventContent/ItemEventCommunitie/ItemEventCommunitie'
import { ItemEventMultipurpose } from '@/components/ItemsEventContent/ItemEventMultipurpose/ItemEventMultipurpose'
import { ItemEventProfile } from '@/components/ItemsEventContent/ItemEventProfile/ItemEventProfile'
import { Kinds } from '@/modules/const/kinds'
import { getTagValue } from '@/modules/nostr'
import { AugmentedEvent } from '@/types/augmented-event'
import { AuthoredEvent } from '@/types/authored-event'
import { ExtendedCommunityEvent } from '@/types/communities'
import { MetaEvent } from '@/types/meta-event'

export interface ItemProps {
  expandMore?: boolean
  isOpenLink?: boolean
}

export interface IContentPreviewComponent {
  author?: MetaEvent
  pubkey: string
  time: number
  kind: number
  content: string
  title?: string
  name?: string
  picture?: string
  community?: ExtendedCommunityEvent
}

export const createPreviewEvent = (event: AugmentedEvent): IContentPreviewComponent => {
  const kind = event.kind as number
  return {
    author: kind === Kinds.META ? (event as MetaEvent) : (event as AuthoredEvent).author,
    pubkey: event.pubkey,
    time: event.created_at,
    kind: event.kind,
    content:
      getTagValue(event, 'summary') || getTagValue(event, 'description') || getTagValue(event, 'alt') || event.content,
    title: getTagValue(event, 'title') || getTagValue(event, 'name'),
    community: (event.kind as number) === Kinds.COMMUNITY ? (event as ExtendedCommunityEvent) : undefined
  }
}

export const getPreviewComponentEvent = (e: IContentPreviewComponent, props?: ItemProps) => {
  switch (e.kind) {
    case Kinds.META: {
      const profileEvent = {
        author: e.author,
        pubkey: e.pubkey,
        content: e.author?.profile?.about,
        website: e.author?.profile?.website,
        kind: e.kind
      }

      return <ItemEventProfile {...props} event={profileEvent} />
    }

    case Kinds.NOTE: {
      const postEvent = {
        author: e.author,
        pubkey: e.pubkey,
        time: e.time,
        content: e.content,
        kind: e.kind
      }

      return <ItemEventMultipurpose {...props} event={postEvent} />
    }

    case Kinds.COMMUNITY: {
      const communitietEvent = {
        name: e.community?.name || '',
        picture: e.community?.image || '',
        pubkey: e.pubkey,
        time: e.time,
        kind: e.kind,
        content: e.content,
        title: e.community?.posts ? `+${e.community?.posts} posts` : undefined
      }

      return <ItemEventCommunitie {...props} event={communitietEvent} />
    }

    default: {
      const defaultEvent = {
        author: e.author,
        pubkey: e.pubkey,
        time: e.time,
        kind: e.kind,
        content: e.content,
        title: e.title
      }

      return <ItemEventMultipurpose {...props} event={defaultEvent} />
    }
  }
}
