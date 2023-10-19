import { FC } from 'react'
import { BookmarkListItemProps } from './types'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { StyledProfileInfo } from '@/shared/ContentComponents/ProfileInfo/styled'
import { StyledProfileName } from '@/shared/Profile/styled'
import { StyledBookmarksCount, StyledContent, StyledWrapper } from './styled'

export const BookmarkListItem: FC<BookmarkListItemProps> = ({
  onClick = () => undefined,
  description = '',
  created_at: time = 0,
  privateBookmarks = [],
  publicBookmarks = [],
  name = ''
}) => {
  const bookmarksCount = privateBookmarks.length + publicBookmarks.length
  const bookmarkText = bookmarksCount === 1 ? 'bookmark' : 'bookmarks'

  return (
    <StyledWrapper onClick={onClick}>
      <Head>
        <StyledProfileInfo>
          <StyledProfileName>{name}</StyledProfileName>
        </StyledProfileInfo>
        <Time date={time} />
      </Head>
      <StyledContent contentLine={2}>{description || 'No description'}</StyledContent>
      <StyledBookmarksCount>
        {bookmarksCount} {bookmarkText}
      </StyledBookmarksCount>
    </StyledWrapper>
  )
}
