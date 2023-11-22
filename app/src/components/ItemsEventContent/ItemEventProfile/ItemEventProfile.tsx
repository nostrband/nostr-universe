import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { ExpandMore, StyledItemSelectedEventActions } from './styled'
import { MetaEvent } from '@/types/meta-event'
import { ContentCollapse } from '@/shared/ContentComponents/ContentCollapse/Content'
import { KindView } from '@/shared/ContentComponents/KindView/KindView'
import { kindNames } from '@/consts'
import { WebsiteView } from '@/shared/ContentComponents/WebsiteView/WebsiteView'
import { ItemProps } from '@/utils/helpers/prepare-component'
import { Content } from '@/shared/ContentComponents/Content/Content'

interface IItemEventProfile extends ItemProps {
  event: {
    content?: string
    author?: MetaEvent
    pubkey: string
    kind: number
    website?: string
  }
}

export const ItemEventProfile = ({ event, expandMore = true, isOpenLink }: IItemEventProfile) => {
  const MAX_LENGTH_CONTENT = 200
  const [openContent, setOpenContent] = useState(false)

  const handleExpandClick = () => {
    setOpenContent((prev) => !prev)
  }

  const kind = kindNames[event.kind] || event.kind

  return (
    <Wrapper>
      <Head>
        <ProfileInfo profile={event.author} pubkey={event.pubkey} />
      </Head>

      {event.website && <WebsiteView isOpenLink={isOpenLink} url={event.website} />}
      {expandMore && event.content ? (
        <ContentCollapse maxContentLength={MAX_LENGTH_CONTENT} open={openContent} text={event.content} />
      ) : (
        <Content contentLine={10}>{event.content}</Content>
      )}

      <StyledItemSelectedEventActions>
        <KindView>{kind}</KindView>
        {expandMore && event.content && event.content.length > MAX_LENGTH_CONTENT && (
          <ExpandMore expand={openContent} onClick={handleExpandClick}>
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </StyledItemSelectedEventActions>
    </Wrapper>
  )
}
