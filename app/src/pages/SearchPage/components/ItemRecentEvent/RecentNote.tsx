import { memo } from 'react'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { IRecentNote } from './types'
import { StyledDeleteButton, StyledQueryTimeInfo, StyledWrapper } from './styled'
import { Content } from '@/shared/ContentComponents/Content/Content'

export const RecentNote = memo(function ItemTrendingNote({
  author,
  pubkey,
  time,
  content,
  onClick,
  queryTimeInfo = '',
  onDeleteRecentEvent = () => undefined
}: IRecentNote) {
  return (
    <StyledWrapper onClick={onClick}>
      <StyledDeleteButton
        onClick={(e) => {
          e.stopPropagation()
          onDeleteRecentEvent()
        }}
      />
      <Head>
        <ProfileInfo profile={author} pubkey={pubkey} />
        <Time date={time} />
      </Head>
      <Content>{content}</Content>
      {queryTimeInfo && <StyledQueryTimeInfo>{queryTimeInfo}</StyledQueryTimeInfo>}
    </StyledWrapper>
  )
})
