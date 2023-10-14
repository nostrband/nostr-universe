import { useSearchParams } from 'react-router-dom'
import { StyledWrapVisibility } from '../styled'
import { ContactList } from '../MainPage/components/ContactList/ContactList'
import BestNotes from './components/BestNotes/BestNotes'
import { BestLongNotes } from './components/BestLongNotes/BestLongNotes'

export const BookmarksPageContent = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'bookmarks'

  return (
    <StyledWrapVisibility isShow={isShow}>
      <ContactList />
      <BestNotes />
      <BestLongNotes />
    </StyledWrapVisibility>
  )
}
