import { LongPost, ReturnTypeLongPosts } from '@/types/long-notes'

export interface ISliderLongPost {
  data: ReturnTypeLongPosts | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: LongPost) => void
}
