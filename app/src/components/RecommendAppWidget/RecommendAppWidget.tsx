import { useEffect, useCallback, useState } from 'react'
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
import { isGuest } from '@/utils/helpers/prepare-data'

export const RecommendAppWidget = () => {
  const { currentPubkey } = useAppSelector(selectKeys)
  const { apps } = useAppSelector((state) => state.selectAppHistory)
  const [newApps, setNewApps] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const { signEvent } = useSigner()

  const filterNewApps = useCallback(
    async (list: any[]) => {
      const recomms = await fetchAppRecomms(currentPubkey)
      // eslint-disable-next-line
      const newApps: any[] = list.filter((r: any) => {
        return !recomms.find((e) => e.identifier === `${r.kind}` && e.naddrs.includes(r.naddr))
      })
      console.log('newApps', newApps, 'list', list, 'recomms', recomms)
      return newApps
    },
    [currentPubkey]
  )

  const updateNewApps = useCallback(
    async (apps: any[]) => {
      if (!isGuest(currentPubkey)) {
        const newApps = await filterNewApps(apps)
        setNewApps(newApps)
      } else {
        setNewApps(apps)
      }
    },
    [filterNewApps, setNewApps]
  )

  const getSelectAppHistory = useCallback(async () => {
    const apps = await dbi.getListSelectAppHistory(currentPubkey)
    dispatch(setSelectAppHistory({ apps }))
  }, [currentPubkey])

  useEffect(() => {
    // load all history from db on key change
    getSelectAppHistory()
  }, [currentPubkey])

  useEffect(() => {
    // filter newApps by existing recomms on apps change
    updateNewApps(apps)
  }, [apps])

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
    newApps
      .filter((el) => el.numberOfLaunch >= 3 && el.nextSuggestTime < Date.now())
      .sort(function (a, b) {
        const dateComparison = b.nextSuggestTime - a.nextSuggestTime

        return dateComparison
      }) || []

  const app = getApps[0]
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
