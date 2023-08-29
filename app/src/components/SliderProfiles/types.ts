import { ITrendingProfiles, TrendingProfile } from '@/types/trending-profiles'

export interface ISliderProfiles {
  data: ITrendingProfiles | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: TrendingProfile) => void
}
