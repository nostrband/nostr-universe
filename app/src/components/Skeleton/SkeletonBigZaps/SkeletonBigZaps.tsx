import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'

export const SkeletonBigZaps = () => {
  const mockBigZaps = generateSkeletonItems({})

  return mockBigZaps.map((_, index) => {
    return (
      <Wrapper key={`slide_${index}`}>
        <Head>
          <SkeletonAvatar />
          <SkeletonText hasSpacing />
        </Head>
        <SubTitle>
          <SkeletonText size="small" />
        </SubTitle>
      </Wrapper>
    )
  })
}
