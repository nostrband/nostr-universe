import { StyledWrapVisibility } from '../styled'
import { ContactList } from '../MainPage/components/ContactList/ContactList'
import BestNotes from './components/BestNotes/BestNotes'
import { BestLongNotes } from './components/BestLongNotes/BestLongNotes'
import { BookmarkLists } from './components/BookmarkLists/BookmarkLists'
import { ProfileLists } from './components/ProfileLists/ProfileLists'
import { getSlug } from '@/utils/helpers/general'
import { useAppSelector } from '@/store/hooks/redux'
import { memo } from 'react'

export const BookmarksPageContent = memo(function BookmarksPageContent() {
  // const isShow = searchParams.get('page') === 'bookmarks'
  const isShow = useAppSelector((state) => getSlug(state.router.slugs, 'bookmarks'))

  return (
    <StyledWrapVisibility isShow={isShow}>
      <ContactList />
      <BestNotes />
      <BestLongNotes />
      <BookmarkLists />
      <ProfileLists />
    </StyledWrapVisibility>
  )
})
