import { memo } from 'react'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { StyledContent, StyledWrapper } from './styled'
import { ReactionTime } from '../../ReactionTime/ReactionTime'
import { IBestLongNoteItem } from './types'
import { Time } from '@/shared/ContentComponents/Time/Time'

export const BestLongNoteItem = memo(function BestLongNoteItem({
  content,
  pubkey,
  author,
  time,
  reactionKind,
  reactionTime,
  onClick
}: IBestLongNoteItem) {
  return (
    <StyledWrapper onClick={onClick}>
      <Head>
        <ProfileInfo pubkey={pubkey} profile={author} />
        <Time date={time} />
      </Head>
      <StyledContent contentLine={2}>{content}</StyledContent>
      <ReactionTime kind={reactionKind} time={reactionTime} />
    </StyledWrapper>
  )
})
