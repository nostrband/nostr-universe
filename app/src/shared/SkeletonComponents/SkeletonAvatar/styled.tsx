import { Skeleton, styled } from '@mui/material'
import { StyledSkeletonAvatarProps } from './types'
import { SKELETON_AVATAR_SIZE_VALUE } from './const'
import { APP_NOSTR_SIZE } from '@/consts'

export const StyledSkeletonAvatar = styled((props: StyledSkeletonAvatarProps) => {
  return <Skeleton {...props} />
})(({ size = APP_NOSTR_SIZE.MEDIUM }) => ({
  width: SKELETON_AVATAR_SIZE_VALUE[size],
  height: SKELETON_AVATAR_SIZE_VALUE[size]
}))
