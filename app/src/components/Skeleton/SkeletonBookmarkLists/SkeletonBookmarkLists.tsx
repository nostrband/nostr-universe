import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'

import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonBookmarkLists = () => {
  const mockSkeletonBookmarkLists = generateSkeletonItems({})

  return mockSkeletonBookmarkLists.map((_, index) => {
    return (
      <Wrapper key={`slide_${index}`}>
        <Head>
          <SkeletonText />
        </Head>
        <Content>
          <SkeletonContent size="big" />
        </Content>
      </Wrapper>
    )
  })
}
