import { LiveEvent } from '@/types/live-events'

export interface ISliderLiveEvents {
  data: LiveEvent[] | undefined
  isLoading?: boolean
  handleClickEntity: (liveEvent: LiveEvent) => void
}
