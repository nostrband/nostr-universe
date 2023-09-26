import { ZapEvent } from '@/types/zap-event'

export interface ISliderBigZaps {
  data: ZapEvent[] | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: ZapEvent) => void
  handleReloadEntity?: () => void
}
