import { Kind } from '@nostrband/nostr-tools'

export enum KINDS {
  KIND_NOTE = Kind.Text,
  KIND_REPOST = Kind.Repost,
  KIND_REACTION = Kind.Reaction
}

export type ReactionTimeProps = {
  kind: number
  time: number
}
