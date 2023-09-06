import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemLiveEvent } from './types'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { StyledTime } from '@/shared/ContentComponents/Time/styled'

export const ItemLiveEvent = ({ content, name, picture, subtitle, time, status }: IItemLiveEvent) => {
  const isLiveEvent = status === 'live'
  return (
    <Wrapper>
      <Head>
        <ProfileInfo picture={picture} name={name} />
        {isLiveEvent ? <StyledTime>Live</StyledTime> : <Time date={time} />}
      </Head>
      <SubTitle>{subtitle}</SubTitle>
      <Content contentLine={2}>{content}</Content>
    </Wrapper>
  )
}
