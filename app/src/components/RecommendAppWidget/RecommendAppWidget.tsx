import { useEffect, useState } from 'react'
import { Button, Container } from '@mui/material'
import { StyledActions, StyledContainer, StyledTitle } from './styled'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { dbi } from '@/modules/db'

type TypeListSelectApp = {
  name: string
  timestamp: number
  pubkey: string
  naddr: string
  kind: number
}

export const RecommendAppWidget = ({ currentPubkey }: { currentPubkey: string }) => {
  const [listSelectApp, setListSelectApp] = useState<TypeListSelectApp[]>([])
  const [nextSuggestTime, setNextSuggestTime] = useState(0)

  const getSelectAppHistory = async (key: string) => {
    const list = await dbi.getListSelectAppHistory(key)

    setListSelectApp(list)
  }

  const getNextSuggestTime = async () => {
    const timestamp = await dbi.getNextSuggestTime()
    console.log({ timestamp })

    if (timestamp.length) {
      setNextSuggestTime(timestamp[0].timestamp)
    }
  }

  useEffect(() => {
    getSelectAppHistory(currentPubkey)
    getNextSuggestTime()
  }, [currentPubkey])

  const handleAgree = async () => {
    const currentDate = new Date()
    const tomorrowTimestamp = currentDate.getTime() + 24 * 60 * 60 * 1000

    await dbi.setNextSuggestTime({ timestamp: tomorrowTimestamp })
    setNextSuggestTime(tomorrowTimestamp)
    // nostr.publishAppRecommendation(kind, app.naddr)
  }

  const handleRecent = async () => {
    const currentDate = new Date()
    const nextWeekTimestamp = currentDate.getTime() + 7 * 24 * 60 * 60 * 1000

    await dbi.setNextSuggestTime({ timestamp: nextWeekTimestamp })

    setNextSuggestTime(nextWeekTimestamp)
  }

  const app = listSelectApp[0]

  if (nextSuggestTime > Date.now()) {
    return null
  }

  if (!app) {
    return null
  }

  return (
    <StyledContainer>
      <Container>
        <Wrapper>
          <StyledTitle>
            Would you like to recommend app {app.name} for kind {app.kind} to your followers
          </StyledTitle>
          <StyledActions>
            <Button fullWidth variant="contained" className="button" color="actionPrimary" onClick={handleAgree}>
              Yes
            </Button>
            <Button fullWidth variant="contained" className="button" color="actionPrimary" onClick={handleRecent}>
              Later
            </Button>
          </StyledActions>
        </Wrapper>
      </Container>
    </StyledContainer>
  )
}
