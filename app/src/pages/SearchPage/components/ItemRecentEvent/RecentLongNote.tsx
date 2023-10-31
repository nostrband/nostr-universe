import { memo } from 'react'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { IRecentLongNote } from './types'
import { StyledQueryTimeInfo, StyledWrapper, StyledDeleteButton } from './styled'
import { Content } from '@/shared/ContentComponents/Content/Content'

export const RecentLongNote = memo(function ItemLongNote({
  pubkey,
  author,
  time,
  content,
  subtitle,
  onClick,
  queryTimeInfo = '',
  onDeleteRecentEvent = () => undefined
}: IRecentLongNote) {
  return (
    <StyledWrapper onClick={onClick}>
      <StyledDeleteButton
        onClick={(e) => {
          e.stopPropagation()
          onDeleteRecentEvent()
        }}
      />
      <Head>
        <ProfileInfo pubkey={pubkey} profile={author} />
        <Time date={time} />
      </Head>
      <SubTitle>{subtitle}</SubTitle>
      <Content contentLine={2}>{content}</Content>
      {queryTimeInfo && <StyledQueryTimeInfo>{queryTimeInfo}</StyledQueryTimeInfo>}
    </StyledWrapper>
  )
})
