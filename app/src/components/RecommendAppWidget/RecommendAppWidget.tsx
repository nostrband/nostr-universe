import { useEffect, useState, useCallback } from 'react'
import { Button, Container } from '@mui/material'
import { StyledActions, StyledContainer, StyledText, StyledTitle } from './styled'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { dbi } from '@/modules/db'
import { kindNames } from '@/consts'
import { useSigner } from '@/hooks/signer'
import { fetchAppRecomms, publishAppRecommendation } from '@/modules/nostr'
import { showToast } from '@/utils/helpers/general'

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
  const { signEvent } = useSigner()

  const getSelectAppHistory = useCallback(async (key: string) => {
    const list = await dbi.getListSelectAppHistory(key)
    const recomms = await fetchAppRecomms(key)
    const newApps: any[] = list.filter((r: any) => {
      return !recomms.find(e => e.identifier === `${r.kind}` && e.naddrs.includes(r.naddr))
    })
    console.log("newApps", newApps, "list", list, "recomms", recomms)

    setListSelectApp(newApps)
  }, [])

  const getNextSuggestTime = useCallback(async () => {
    const timestamp = await dbi.getNextSuggestTime()
    console.log("nextSuggestTime", { timestamp })

    if (timestamp.length) {
      setNextSuggestTime(timestamp[0].timestamp)
    }
  }, [])

  useEffect(() => {
    getSelectAppHistory(currentPubkey)
    getNextSuggestTime()
  }, [currentPubkey])

  const handleAgree = async () => {
    const currentDate = new Date()
    // 10 minutes
    const nextTimestamp = currentDate.getTime() + 10 * 60 * 1000

    dbi.setNextSuggestTime({ timestamp: nextTimestamp })
    setNextSuggestTime(nextTimestamp)

    await publishAppRecommendation(signEvent, currentPubkey, app.kind, app.naddr)

    showToast("Added to your app list!")
  }

  const handleRecent = async () => {
    const currentDate = new Date()
    // 1 day
    const nextTimestamp = currentDate.getTime() + 24 * 60 * 60 * 1000

    dbi.setNextSuggestTime({ timestamp: nextTimestamp })

    setNextSuggestTime(nextTimestamp)
  }

  const app = listSelectApp[0]

  if (nextSuggestTime > Date.now()) {
    return null
  }

  if (!app) {
    return null
  }

  const kind = (kindNames[app.kind] || `kind {app.kind}`) + " events"

  return (
    <StyledContainer>
      <Container>
        <Wrapper>
          <StyledTitle>
            Recommend <b>{app.name}</b> for <b>{kind}</b> to your followers?
          </StyledTitle>
          <StyledText>
            Adds <b>{app.name}</b> to your public list of apps.
          </StyledText>
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
