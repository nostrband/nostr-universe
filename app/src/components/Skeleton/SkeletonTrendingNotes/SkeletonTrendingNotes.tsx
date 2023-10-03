import { Head } from '@/shared/ContentComponents/Head/Head'
import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonTrendingNotes = () => {
  const mockTrendingNotes = generateSkeletonItems({})
  return mockTrendingNotes.map((_, index) => {
    return (
      <Wrapper key={`slide_${index}`}>
        <Head>
          <SkeletonAvatar />
          <SkeletonText hasSpacing />
        </Head>
        <Content>
          <SkeletonContent size="big" />
        </Content>
      </Wrapper>
    )
  })
}
