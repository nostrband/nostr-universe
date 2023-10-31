import { ProfileListEvent } from '@/types/profile-list-event'

export type ProfileListItemProps = ProfileListEvent & {
  onClick: () => void
}
