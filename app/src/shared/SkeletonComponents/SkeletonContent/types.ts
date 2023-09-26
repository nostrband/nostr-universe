import { AppNostrSize } from '@/types/app-nostr'
import { SkeletonProps } from '@mui/material'

export type SkeletonContentProps = {
  size?: AppNostrSize
  width?: string | number
  animation?: SkeletonProps['animation']
}

export type StyledSkeletonContentProps = SkeletonContentProps & SkeletonProps
