import { BoxProps, TypographyProps } from '@mui/material'
import { OverridableStringUnion } from '../../types/utility'
import { APP_NOSTRO_SIZE } from './const'

export type AppNostro = {
  name?: string
  img: string
}

export type AppNostroSizeUnion = (typeof APP_NOSTRO_SIZE)[keyof typeof APP_NOSTRO_SIZE]

export type AppNostroSize = OverridableStringUnion<AppNostroSizeUnion>

export interface IAppNostro {
  app: AppNostro
  size?: AppNostroSize
  hideName?: boolean
}

export interface IBoxStyled extends BoxProps {
  size?: AppNostroSize
}

export interface INameStyled extends TypographyProps {
  size?: AppNostroSize
}
