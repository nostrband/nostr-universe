import { LiveEvent, ReturnTypeLiveEvents } from '@/types/live-events'

export interface ISliderLiveEvents {
  data: ReturnTypeLiveEvents | undefined
  isLoading?: boolean
  handleClickEntity: (liveEvent: LiveEvent) => void
}
