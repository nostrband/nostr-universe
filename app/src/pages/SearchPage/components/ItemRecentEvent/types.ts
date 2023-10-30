import { IItemLongNote } from '@/components/ItemsContent/ItemLongNote/types'
import { IItemTrendingNote } from '@/components/ItemsContent/ItemTrendingNote/types'
import { IProfile } from '@/shared/Profile/types'

type RecentEventProps = { queryTimeInfo?: string; onDeleteRecentEvent?: () => void }

export type IRecentProfile = IProfile & RecentEventProps

export type IRecentNote = IItemTrendingNote & RecentEventProps

export type IRecentLongNote = IItemLongNote & RecentEventProps
