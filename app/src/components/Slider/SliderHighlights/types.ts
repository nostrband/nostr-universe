import { ReturnTypeHighlight, ReturnTypeHighlights } from '@/types/contentWorkSpace'

export interface ISliderHighlights {
  data: ReturnTypeHighlights | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: ReturnTypeHighlight) => void
}
