import { MetaEvent } from '@/types/meta-event'

export interface IProfile {
  profile: MetaEvent
  isContact?: boolean
  onClick?: (pubkey: string) => void
}
