import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemLongPost } from './types'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'

export const ItemLongPost = ({ name, picture, time, content, subtitle }: IItemLongPost) => {
  return (
    <Wrapper>
      <Head>
        <ProfileInfo picture={picture} name={name} />
        <Time date={time} />
      </Head>
      <SubTitle>{subtitle}</SubTitle>
      <Content contentLine={2}>{content}</Content>
    </Wrapper>
  )
}
