import { MetaEvent } from '@/types/meta-event'

export interface ISliderContacts {
  data: MetaEvent[] | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: MetaEvent) => void
}
