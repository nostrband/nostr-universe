import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemCommunity } from './types'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { CommunityInfo } from '@/shared/ContentComponents/CommunityInfo/CommunityInfo'
import { memo } from 'react'

export const ItemCommunity = memo(({ name, picture, time, content, subtitle }: IItemCommunity) => {
  return (
    <Wrapper>
      <Head>
        <CommunityInfo name={name} picture={picture} />
        <Time date={time} />
      </Head>
      <SubTitle>{subtitle}</SubTitle>
      <Content contentLine={2}>{content}</Content>
    </Wrapper>
  )
})
