import { BoxProps, TypographyProps } from '@mui/material'
import { OverridableStringUnion } from '@/types/utility'
import { APP_NOSTRO_SIZE } from './const'
import { AppNostro } from '@/types/app-nostro'

export type AppNostroSizeUnion = (typeof APP_NOSTRO_SIZE)[keyof typeof APP_NOSTRO_SIZE]

export type AppNostroSize = OverridableStringUnion<AppNostroSizeUnion>

export interface IAppNostro {
  app: AppNostro
  size?: AppNostroSize
  isPreviewTab?: boolean
  hideName?: boolean
  isActive?: boolean
  disabled?: boolean
  onOpen: (app: AppNostro) => void
}

export interface IBoxStyled extends BoxProps {
  size?: AppNostroSize
  isActive?: boolean
  isPreviewTab?: boolean
}

export interface INameStyled extends TypographyProps {
  size?: AppNostroSize
}
