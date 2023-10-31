import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { StyledProfile } from '@/shared/Profile/styled'

export const SkeletonContactList = () => {
  const mockContacts = generateSkeletonItems({})

  return mockContacts.map((_, index) => {
    return (
      <StyledProfile key={`slide_${index}`}>
        <SkeletonAvatar size="large" />
        <SkeletonText width={'5rem'} fullWidth={false} />
      </StyledProfile>
    )
  })
}
