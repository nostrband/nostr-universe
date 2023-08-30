import { Communitie, ReturnTypeCommunities } from '@/types/communities'

export interface ISliderCommunities {
  data: ReturnTypeCommunities | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: Communitie) => void
}
