import { HighlightEvent } from '@/types/highlight-event'

export interface ISliderHighlights {
  data: HighlightEvent[] | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: HighlightEvent) => void
}
