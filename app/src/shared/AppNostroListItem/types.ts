import { IOpenAppNostr } from '@/types/app-nostr'

export interface IAppNostroListItem {
  app: IOpenAppNostr
  onClick: () => void
}
