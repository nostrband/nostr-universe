import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonLongPosts = () => {
  const mockLongPosts = generateSkeletonItems({})

  return mockLongPosts.map((_, index) => {
    return (
      <Wrapper key={`slide_${index}`}>
        <Head>
          <SkeletonAvatar />
          <SkeletonText hasSpacing />
        </Head>
        <SubTitle>
          <SkeletonText size="small" />
        </SubTitle>
        <Content>
          <SkeletonContent />
        </Content>
      </Wrapper>
    )
  })
}
