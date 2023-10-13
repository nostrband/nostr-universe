import { memo } from 'react'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { IBestNoteItem } from './types'
import { StyledContent, StyledWrapper } from './styled'
import { ReactionTime } from '../../ReactionTime/ReactionTime'

export const BestNoteItem = memo(function BestNoteItem({
  content,
  pubkey,
  author,
  reactionKind,
  reactionTime
}: IBestNoteItem) {
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
