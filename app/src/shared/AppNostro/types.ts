import { BoxProps, TypographyProps } from '@mui/material'
import { AppNostr, AppNostrSize } from '@/types/app-nostr'

export interface IAppNostro {
  app: AppNostr
  size?: AppNostrSize
  isPreviewTab?: boolean
  hideName?: boolean
  isActive?: boolean
  disabled?: boolean
  onOpen: (app: AppNostr) => void
  containerProps?: IBoxStyled
}

export interface IBoxStyled extends BoxProps {
  size?: AppNostrSize
  isActive?: boolean
  isPreviewTab?: boolean
}

export interface INameStyled extends TypographyProps {
  size?: AppNostrSize
}
