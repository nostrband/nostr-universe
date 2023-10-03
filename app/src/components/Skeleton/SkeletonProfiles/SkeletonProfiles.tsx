import { StyledProfile } from '@/shared/Profile/styled'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonProfiles = () => {
  const mockProfiles = generateSkeletonItems({})

  return mockProfiles.map((_, index) => {
    return (
      <StyledProfile key={`slide_${index}`}>
        <SkeletonAvatar size="large" />
        <SkeletonText width={'4rem'} fullWidth={false} />
        <SkeletonContent width="90%" />
      </StyledProfile>
    )
  })
}
