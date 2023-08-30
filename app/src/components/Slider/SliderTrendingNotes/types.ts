import { TrendingNote, TrendingNotes } from '@/types/trending-notes'

export interface ISliderTrendingNotes {
  data: TrendingNotes | undefined
  isLoading?: boolean
  handleClickEntity?: (note: TrendingNote) => void
}
