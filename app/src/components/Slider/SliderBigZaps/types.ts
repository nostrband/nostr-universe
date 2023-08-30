import { BigZap, ReturnTypeBigZaps } from '@/types/big-zaps'

export interface ISliderBigZaps {
  data: ReturnTypeBigZaps | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: BigZap) => void
}
