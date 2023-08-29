import { IOpenAppNostro } from '@/types/app-nostro'

export interface IAppNostroListItem {
  app: IOpenAppNostro
  onClick: () => void
}
