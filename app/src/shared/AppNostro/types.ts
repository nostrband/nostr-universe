import { BoxProps, TypographyProps } from '@mui/material'
import { AppNostro, AppNostroSize } from '@/types/app-nostro'

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
