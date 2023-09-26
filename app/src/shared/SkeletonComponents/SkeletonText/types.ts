import { SkeletonProps } from '@mui/material'
import { AppNostrSize } from '@/types/app-nostr'

export type SkeletonTextProps = {
  width?: string | number
  size?: AppNostrSize
  animation?: SkeletonProps['animation']
  hasSpacing?: boolean
  fullWidth?: boolean
}
