import { memo } from 'react'
import { StyledSubtitle } from './styled'
import { KINDS, ReactionTimeProps } from './types'
import { formatTime } from '@/utils/helpers/prepare-data'

const REACTION_TYPE_LABELS: Record<number, string> = {
  [KINDS.KIND_NOTE]: 'Replied',
  [KINDS.KIND_REPOST]: 'Reposted',
  [KINDS.KIND_REACTION]: 'Reacted'
}

export const ReactionTime = memo(function ReactionTime({ kind, time }: ReactionTimeProps) {
  const label = REACTION_TYPE_LABELS[kind]
  const formattedTime = formatTime(time)
  return (
    <StyledSubtitle>
      {label} {formattedTime} ago
    </StyledSubtitle>
  )
})
