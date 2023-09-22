import { LongNoteEvent } from '@/types/long-note-event'

export interface ISliderLongNotes {
  data: LongNoteEvent[] | undefined
  isLoading?: boolean
  handleClickEntity?: (e: LongNoteEvent) => void
}
