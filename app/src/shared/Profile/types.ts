import { TrendingProfile } from '@/types/trending-profiles'

export interface IProfile {
  profile: TrendingProfile
  isContact?: boolean
  onClick?: (profile: TrendingProfile) => void
}
