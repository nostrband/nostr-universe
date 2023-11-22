import { ItemEventCommunitie } from '@/components/ItemsEventContent/ItemEventCommunitie/ItemEventCommunitie'
import { ItemEventMultipurpose } from '@/components/ItemsEventContent/ItemEventMultipurpose/ItemEventMultipurpose'
import { ItemEventProfile } from '@/components/ItemsEventContent/ItemEventProfile/ItemEventProfile'
import { ExtendedCommunityEvent } from '@/types/communities'
import { MetaEvent } from '@/types/meta-event'

export interface ItemProps {
  expandMore?: boolean
  isOpenLink?: boolean
}

export interface IContentPreviewComponent {
  author: MetaEvent
  pubkey: string
  time: number
  kind: number
  content: string
  title?: string
  name?: string
  picture?: string
  post?: ExtendedCommunityEvent
}

export const getPreviewComponentEvent = (contentPreviewComponent: IContentPreviewComponent, props?: ItemProps) => {
  switch (contentPreviewComponent.kind) {
    case 0: {
      const profileEvent = {
        author: contentPreviewComponent.author,
        pubkey: contentPreviewComponent.pubkey,
        content: contentPreviewComponent.author?.profile?.about,
        website: contentPreviewComponent.author?.profile?.website,
        kind: contentPreviewComponent.kind
      }

      return <ItemEventProfile {...props} event={profileEvent} />
    }

    case 1: {
      const postEvent = {
        author: contentPreviewComponent.author,
        pubkey: contentPreviewComponent.pubkey,
        time: contentPreviewComponent.time,
        content: contentPreviewComponent.content,
        kind: contentPreviewComponent.kind
      }

      return <ItemEventMultipurpose {...props} event={postEvent} />
    }

    case 34550: {
      const communitietEvent = {
        name: contentPreviewComponent.post?.name || '',
        picture: contentPreviewComponent.post?.image || '',
        pubkey: contentPreviewComponent.pubkey,
        time: contentPreviewComponent.time,
        kind: contentPreviewComponent.kind,
        content: contentPreviewComponent.content,
        title: `+${contentPreviewComponent.post?.posts}`
      }

      return <ItemEventCommunitie {...props} event={communitietEvent} />
    }

    default: {
      const defaultEvent = {
        author: contentPreviewComponent.author,
        pubkey: contentPreviewComponent.pubkey,
        time: contentPreviewComponent.time,
        kind: contentPreviewComponent.kind,
        content: contentPreviewComponent.content,
        title: contentPreviewComponent.title
      }

      return <ItemEventMultipurpose {...props} event={defaultEvent} />
    }
  }
}
