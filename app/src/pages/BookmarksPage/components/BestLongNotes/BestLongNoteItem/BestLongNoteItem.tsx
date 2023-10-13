import { memo } from 'react'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { StyledContent, StyledWrapper } from './styled'
import { ReactionTime } from '../../ReactionTime/ReactionTime'
import { IBestLongNoteItem } from './types'

export const BestLongNoteItem = memo(function BestLongNoteItem({
  content,
  pubkey,
  author,
  reactionKind,
  reactionTime
}: IBestLongNoteItem) {
  return (
    <StyledWrapper>
      <Head>
        <ProfileInfo pubkey={pubkey} profile={author} />
      </Head>
      <StyledContent contentLine={2}>{content}</StyledContent>
      <ReactionTime kind={reactionKind} time={reactionTime} />
    </StyledWrapper>
  )
})
