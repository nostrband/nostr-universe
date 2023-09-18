import { AppNostroSize } from '@/types/app-nostro'
import { BoxProps, AvatarProps } from '@mui/material'

interface IAppIconProps {
  size?: AppNostroSize
  isActive?: boolean
  isPreviewTab?: boolean
  isNotLoaded?: boolean
  isOutline?: boolean
}

export type IBoxStyled = IAppIconProps & BoxProps

export interface IAvatarProps extends AvatarProps {
  size?: AppNostroSize
  isPreviewTab?: boolean
}

export interface IAppIconBase {
  picture?: string
  alt?: string
}

export type IAppIcon = Omit<IAppIconProps, 'isNotLoaded'> & IAppIconBase
