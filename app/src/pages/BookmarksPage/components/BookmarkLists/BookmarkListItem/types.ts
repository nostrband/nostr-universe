import { BookmarkListEvent } from '@/types/bookmark-list-event'

export type BookmarkListItemProps = BookmarkListEvent & {
  onClick: () => void
}
