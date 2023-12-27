import { Head } from '@/shared/ContentComponents/Head/Head'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { SkeletonAvatar } from '@/shared/SkeletonComponents/SkeletonAvatar/SkeletonAvatar'
import { SkeletonText } from '@/shared/SkeletonComponents/SkeletonText/SkeletonText'
import { SkeletonContent } from '@/shared/SkeletonComponents/SkeletonContent/SkeletonContent'

export const SkeletonNote = (props: { key?: string }) => {
  return (
    <Wrapper { ...props }>
      <Head>
        <SkeletonAvatar />
        <SkeletonText hasSpacing />
      </Head>
      <Content>
        <SkeletonContent size="big" />
      </Content>
    </Wrapper>
  )
}
