import { useSearchParams } from 'react-router-dom'
import { StyledWrapVisibility } from '../styled'
import { ContactList } from '../MainPage/components/ContactList/ContactList'

export const BookmarksPageContent = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'bookmarks'

  return (
    <StyledWrapVisibility isShow={isShow}>
      <ContactList />
    </StyledWrapVisibility>
  )
}
