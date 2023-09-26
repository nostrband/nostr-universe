import { MetaEvent } from '@/types/meta-event'

export interface ISliderProfiles {
  data: MetaEvent[] | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: MetaEvent) => void
  handleReloadEntity?: () => void
}
