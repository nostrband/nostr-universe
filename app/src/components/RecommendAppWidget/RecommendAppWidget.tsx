import { useEffect, useCallback } from 'react'
import { Button, Container } from '@mui/material'
import { StyledActions, StyledContainer, StyledText, StyledTitle } from './styled'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { dbi } from '@/modules/db'
import { kindNames } from '@/consts'
import { useSigner } from '@/hooks/signer'
import { fetchAppRecomms, publishAppRecommendation } from '@/modules/nostr'
import { showToast } from '@/utils/helpers/general'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { selectKeys } from '@/store/store'
import { TypeListSelectApp, setSelectAppHistory } from '@/store/reducers/selectAppHistory.slice'

export const RecommendAppWidget = () => {
  const { currentPubkey } = useAppSelector(selectKeys)
  const { apps } = useAppSelector((state) => state.selectAppHistory)
  const dispatch = useAppDispatch()
  const { signEvent } = useSigner()

  const getSelectAppHistory = useCallback(async (key: string) => {
    const list = await dbi.getListSelectAppHistory(key)
    const recomms = await fetchAppRecomms(key)
    // eslint-disable-next-line
    const newApps: any[] = list.filter((r: any) => {
      return !recomms.find((e) => e.identifier === `${r.kind}` && e.naddrs.includes(r.naddr))
    })
    console.log('newApps', newApps, 'list', list, 'recomms', recomms)

    dispatch(setSelectAppHistory({ apps: newApps }))
  }, [])

  useEffect(() => {
    getSelectAppHistory(currentPubkey)
  }, [currentPubkey])

  const handleAgree = async (app: TypeListSelectApp) => {
    const currentDate = new Date()
    // 10 minutes
    const nextTimestamp = currentDate.getTime() + 10 * 60 * 1000

    const getApp = await dbi.setNextSuggestTime({ nextTimestamp, app })
    dispatch(setSelectAppHistory({ apps: [getApp] }))

    await publishAppRecommendation(signEvent, currentPubkey, app.kind, app.naddr)

    showToast('Added to your app list!')
  }

  const handleRecent = async (app: TypeListSelectApp) => {
    const currentDate = new Date()
    // 1 day
    const nextTimestamp = currentDate.getTime() + 24 * 60 * 60 * 1000

    const getApp = await dbi.setNextSuggestTime({ nextTimestamp, app })
    dispatch(setSelectAppHistory({ apps: [getApp] }))
  }

  const getApps =
    apps
      .filter((el) => el.numberOfLaunch >= 3 && el.nextSuggestTime < Date.now())
      .sort(function (a, b) {
        const dateComparison = b.nextSuggestTime - a.nextSuggestTime

        return dateComparison
      }) || []

  const app = getApps[0]

  console.log({ efg6fge6fge: apps })

  if (!app) {
    return null
  }

  if (app.nextSuggestTime > Date.now()) {
    return null
  }

  const kind = (kindNames[app.kind] || `kind {app.kind}`) + ' events'

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
            <Button
              fullWidth
              variant="contained"
              className="button"
              color="actionPrimary"
              onClick={() => handleAgree(app)}
            >
              Yes
            </Button>
            <Button
              fullWidth
              variant="contained"
              className="button"
              color="actionPrimary"
              onClick={() => handleRecent(app)}
            >
              Later
            </Button>
          </StyledActions>
        </Wrapper>
      </Container>
    </StyledContainer>
  )
}
