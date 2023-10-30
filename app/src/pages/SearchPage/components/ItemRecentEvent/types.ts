import { IItemLongNote } from '@/components/ItemsContent/ItemLongNote/types'
import { IItemTrendingNote } from '@/components/ItemsContent/ItemTrendingNote/types'
import { IProfile } from '@/shared/Profile/types'
import { MetaEvent } from '@/types/meta-event'

type RecentEventProps = { queryTimeInfo?: string; onDeleteRecentEvent?: () => void }

export type IRecentProfile = Omit<IProfile, 'onClick'> & RecentEventProps & { onClick: (profile: MetaEvent) => void }

export type IRecentNote = IItemTrendingNote & RecentEventProps

export type IRecentLongNote = IItemLongNote & RecentEventProps
