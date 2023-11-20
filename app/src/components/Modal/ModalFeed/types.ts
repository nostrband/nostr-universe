import { AuthoredEvent } from '@/types/authored-event'
import { HighlightEvent } from '@/types/highlight-event'
import { MetaEvent } from '@/types/meta-event'
import { ZapEvent } from '@/types/zap-event'

export type ReturnDataContent = HighlightEvent[] | AuthoredEvent[] | MetaEvent[] | ZapEvent[]

export interface RowProps {
  data: ReturnDataContent
  index: number
  setSize: (index: number, size: number) => void
}

export interface ModalFeedContentProps {
  dataContent: ReturnDataContent
}
