import { Skeleton, SkeletonProps, styled } from '@mui/material'
import { APP_NOSTR_SIZE } from '@/consts'
import { SkeletonTextProps } from './types'
import { SKELETON_TEXT_FONT_SIZE_VALUE } from './const'

export const StyledSkeletonText = styled((props: SkeletonTextProps & SkeletonProps) => {
  return <Skeleton {...props} variant="text" />
})(({ size = APP_NOSTR_SIZE.MEDIUM, fullWidth, hasSpacing }) => ({
  fontSize: SKELETON_TEXT_FONT_SIZE_VALUE[size],
  flex: fullWidth ? 1 : 'initial',
  width: fullWidth ? '100%' : 'auto',
  marginLeft: hasSpacing ? '0.5rem' : 0
}))
