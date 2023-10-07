import { StyledAppWraper } from '@/shared/AppNostro/styled'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'

export const SkeletonApps = () => {
  const mockApps = generateSkeletonItems({})

  return mockApps.map((_, index) => {
    return (
      <StyledAppWraper key={`slide_${index}`}>
        <SkeletonAvatar variant="rounded" size="big" />
        <SkeletonText width={'4rem'} fullWidth={false} />
      </StyledAppWraper>
    )
  })
}
