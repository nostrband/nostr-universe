import { AppNostrSize } from '@/types/app-nostr'
import { BoxProps, AvatarProps } from '@mui/material'

interface IAppIconProps {
  size?: AppNostrSize
  isActive?: boolean
  isPreviewTab?: boolean
  isNotLoaded?: boolean
  isOutline?: boolean
  isRounded?: boolean
  isLight?: boolean
  isSmall?: boolean
  onClick?: () => void
}

export type IBoxStyled = IAppIconProps & BoxProps

export interface IAvatarProps extends AvatarProps {
  size?: AppNostrSize
  isPreviewTab?: boolean
  isLight?: boolean
  isSmall?: boolean
}

export interface IAppIconBase {
  picture?: string
  alt?: string
}

export type IAppIcon = Omit<IAppIconProps, 'isNotLoaded'> & IAppIconBase
