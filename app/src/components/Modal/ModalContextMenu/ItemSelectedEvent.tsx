import { useState } from 'react'
import { Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Content } from '@/shared/ContentComponents/Content/Content'
import { CurrentEvent } from '@/store/reducers/selectedEvent.slice'
import { ExpandMore, StyledItemSelectedEventActions } from './styled'

interface IItemSelectedEvent {
  currentEvent: CurrentEvent
}

export const ItemSelectedEvent = ({ currentEvent }: IItemSelectedEvent) => {
  const MAX_LENGTH_CONTENT = 150

  const [openContent, setOpenContent] = useState(false)

  const getContent = () => {
    let firstPart = ''
    let lastPart = ''

    if (currentEvent?.content) {
      const lastSpace = currentEvent?.content.slice(0, MAX_LENGTH_CONTENT).lastIndexOf(' ')

      firstPart = currentEvent?.content.slice(0, lastSpace)

      lastPart = currentEvent.content.slice(firstPart.length)
    }

    return { firstPart, lastPart }
  }

  const { firstPart, lastPart } = getContent()

  const handleExpandClick = () => {
    setOpenContent((prev) => !prev)
  }

  return (
    <Wrapper>
      <Head>
        <ProfileInfo profile={currentEvent.author} pubkey={currentEvent.pubkey} />
        {currentEvent.time && <Time date={currentEvent.time} />}
      </Head>
      {currentEvent.content &&
        (currentEvent.content.length <= MAX_LENGTH_CONTENT ? (
          <Content>{currentEvent.content}</Content>
        ) : (
          <>
            <Content isEllipsis={false}>
              {openContent ? firstPart : `${firstPart}...`}
              <Collapse in={openContent} timeout="auto" unmountOnExit>
                {lastPart}
              </Collapse>
            </Content>
            <StyledItemSelectedEventActions>
              <ExpandMore expand={openContent} onClick={handleExpandClick}>
                <ExpandMoreIcon />
              </ExpandMore>
            </StyledItemSelectedEventActions>
          </>
        ))}
    </Wrapper>
  )
}
