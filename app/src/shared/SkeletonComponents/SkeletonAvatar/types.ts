import { AppNostrSize } from '@/types/app-nostr'
import { SkeletonProps } from '@mui/material'

export type SkeletonAvatarProps = {
  size?: AppNostrSize
  animation?: SkeletonProps['animation']
  variant?: Exclude<SkeletonProps['variant'], 'text'>
}

export type StyledSkeletonAvatarProps = SkeletonAvatarProps & SkeletonProps
