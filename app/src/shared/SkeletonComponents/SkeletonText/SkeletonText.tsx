import { FC } from 'react'
import { SkeletonTextProps } from './types'
import { StyledSkeletonText } from './styled'
import { APP_NOSTR_SIZE } from '@/consts'

export const SkeletonText: FC<SkeletonTextProps> = ({
  width = 'auto',
  animation = 'wave',
  size = APP_NOSTR_SIZE.MEDIUM,
  fullWidth = true,
  ...restProps
}) => {
  return <StyledSkeletonText {...restProps} width={width} size={size} animation={animation} fullWidth={fullWidth} />
}
