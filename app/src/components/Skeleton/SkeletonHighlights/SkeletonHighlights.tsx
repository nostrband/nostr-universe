import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonHighlights = () => {
  const mockHighlights = generateSkeletonItems({})

  return mockHighlights.map((_, index) => {
    return (
      <Wrapper key={`slide_${index}`}>
        <Head>
          <SkeletonAvatar />
          <SkeletonText hasSpacing />
        </Head>
        <Content isHighlight>
          <SkeletonContent size="big" />
        </Content>
      </Wrapper>
    )
  })
}
