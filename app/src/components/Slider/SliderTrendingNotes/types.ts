import { AuthoredEvent } from '@/types/authored-event'

export interface ISliderTrendingNotes {
  data: AuthoredEvent[] | undefined
  isLoading?: boolean
  handleClickEntity?: (note: AuthoredEvent) => void
  handleReloadEntity?: () => void
}
