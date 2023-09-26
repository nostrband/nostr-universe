import { FC } from 'react'
import { SkeletonContentProps } from './types'
import { StyledSkeletonContent } from './styled'
import { APP_NOSTR_SIZE } from '@/consts'

export const SkeletonContent: FC<SkeletonContentProps> = ({
  animation = 'wave',
  width = '100%',
  size = APP_NOSTR_SIZE.MEDIUM
}) => {
  return <StyledSkeletonContent animation={animation} width={width} size={size} />
}
