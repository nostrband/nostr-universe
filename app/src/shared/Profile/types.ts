import { MetaEvent } from '@/types/meta-event'

export interface IProfile {
  profile: MetaEvent
  isContact?: boolean
  onClick?: (profile: MetaEvent) => void
}
