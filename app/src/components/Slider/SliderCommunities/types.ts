import { CommunityEvent, ExtendedCommunityEvent } from '@/types/communities'

export interface ISliderCommunities {
  data: ExtendedCommunityEvent[] | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: CommunityEvent) => void
}
