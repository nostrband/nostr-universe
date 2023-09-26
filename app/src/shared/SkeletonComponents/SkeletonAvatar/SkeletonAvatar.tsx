import { FC } from 'react'
import { SkeletonAvatarProps } from './types'
import { StyledSkeletonAvatar } from './styled'
import { APP_NOSTR_SIZE } from '@/consts'

export const SkeletonAvatar: FC<SkeletonAvatarProps> = ({
  variant = 'circular',
  size = APP_NOSTR_SIZE.MEDIUM,
  animation = 'wave',
  ...restProps
}) => {
  return <StyledSkeletonAvatar variant={variant} size={size} animation={animation} {...restProps} />
}
