import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemLiveEvent } from './types'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { EVENT_LIVE_STATUS } from '@/consts'
import { Status } from '@/shared/ContentComponents/Status/Status'
import { Time } from '@/shared/ContentComponents/Time/Time'

export const ItemLiveEvent = ({ content, name, picture, subtitle, time, status }: IItemLiveEvent) => {
  const isLiveEvent = status === EVENT_LIVE_STATUS
  return (
    <Wrapper>
      <Head>
        <ProfileInfo picture={picture} name={name} />
        {isLiveEvent ? <Status status="Live" /> : <Time date={time} />}
      </Head>
      <SubTitle>{subtitle}</SubTitle>
      <Content contentLine={2}>{content}</Content>
    </Wrapper>
  )
}
