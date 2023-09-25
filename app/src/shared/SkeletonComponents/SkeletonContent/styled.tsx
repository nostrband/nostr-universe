import { Skeleton, styled } from '@mui/material'
import { StyledSkeletonContentProps } from './types'
import { APP_NOSTR_SIZE } from '@/consts'
import { SKELETON_CONTENT_HEIGHT_VALUE } from './const'

export const StyledSkeletonContent = styled((props: StyledSkeletonContentProps) => {
  return <Skeleton {...props} variant="rounded" />
})(({ size = APP_NOSTR_SIZE.MEDIUM }) => ({
  height: SKELETON_CONTENT_HEIGHT_VALUE[size],
  borderRadius: '10px'
}))
