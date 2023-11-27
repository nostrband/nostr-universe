import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { ExpandMore, StyledItemSelectedEventActions } from './styled'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { ContentCollapse } from '@/shared/ContentComponents/ContentCollapse/Content'
import { KindView } from '@/shared/ContentComponents/KindView/KindView'
import { kindNames } from '@/consts'
import { ItemProps } from '@/utils/helpers/prepare-component'
import { CommunityInfo } from '@/shared/ContentComponents/CommunityInfo/CommunityInfo'
import { Content } from '@/shared/ContentComponents/Content/Content'

interface IItemEventCommunitie extends ItemProps {
  event: {
    content?: string
    title?: string
    time?: number
    name: string
    pubkey: string
    picture: string
    kind: number
  }
}

export const ItemEventCommunitie = ({ event, expandMore = true }: IItemEventCommunitie) => {
  const MAX_LENGTH_CONTENT = 200
  const [openContent, setOpenContent] = useState(false)

  const handleExpandClick = () => {
    setOpenContent((prev) => !prev)
  }

  const kind = kindNames[event.kind] || event.kind

  return (
    <Wrapper>
      <Head>
        <CommunityInfo name={`/${event.name}`} picture={event.picture} />
        {event.time && <Time date={event.time} />}
      </Head>
      {event.title && <SubTitle>{event.title}</SubTitle>}

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
