import { ITrendingProfiles, TrendingProfile } from '@/types/trending-profiles'

export interface ISliderContacts {
  data: ITrendingProfiles | undefined
  isLoading?: boolean
  handleClickEntity?: (profile: TrendingProfile) => void
}
