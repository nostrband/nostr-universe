import { IAppNostro } from '../AppNostro/types'

export type AppNostroSortableProps = IAppNostro & {
  isDragging: boolean
  id: string | number
}
