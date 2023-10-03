import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemLiveEvent } from './types'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { EVENT_LIVE_STATUS } from '@/consts'
import { Status } from '@/shared/ContentComponents/Status/Status'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { memo } from 'react'

export const ItemLiveEvent = memo(function ItemLiveEvent({
  content,
  hostPubkey,
  host,
  subtitle,
  time,
  status,
  onClick
}: IItemLiveEvent) {
  const isLiveEvent = status === EVENT_LIVE_STATUS
  return (
    <Wrapper onClick={onClick}>
      <Head>
        <ProfileInfo pubkey={hostPubkey} profile={host} />
        {isLiveEvent ? <Status status="Live" /> : <Time date={time} />}
      </Head>
      <SubTitle>{subtitle}</SubTitle>
      <Content contentLine={2}>{content}</Content>
    </Wrapper>
  )
})
