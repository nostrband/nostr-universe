import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Container } from '@/layout/Container/Conatiner'
import { IconButton } from '@mui/material'
import { fetchAppsForEvent, getHandlerEventUrl, parseAddr } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenApp } from '@/hooks/open-entity'
import { StyledForm, StyledNoAppsMessage } from './styled'
import { IOpenAppNostr } from '@/types/app-nostr'
import { AppNostroListItem } from '@/shared/AppNostroListItem/AppNostroListItem'
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { NATIVE_NADDR } from '@/consts'
import { selectCurrentWorkspace } from '@/store/store'
import { Input } from '@/shared/Input/Input'
import { IModalSelectAppContent } from './types'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'
import { usePins } from '@/hooks/pins'

export const ModalSelectAppContent = ({ handleSetKind }: IModalSelectAppContent) => {
  const { openApp } = useOpenApp()
  const { findAppPin } = usePins()
  const [searchValue, setSearchValue] = useState('')
  const [kind, setKind] = useState('')
  const [apps, setApps] = useState<IOpenAppNostr[]>([])
  const [isAppsFailed, setIsAppsFailed] = useState(false)
  const [isAppsLoading, setIsAppsLoading] = useState(false)
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)

  const [searchParams] = useSearchParams()
  const paramSearchUrl = EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]
  const paramSearchKind = searchParams.get(MODAL_PARAMS_KEYS.KIND) || ''

  const getParamAddr = searchParams.get(paramSearchUrl) || ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const filteredApps = apps.filter((app) => {
    return app.name.toLowerCase().includes(searchValue.toLowerCase())
  })

  const load = useCallback(async () => {
    try {
      setIsAppsFailed(false)
      setIsAppsLoading(true)

      if (paramSearchKind) {
        setKind(paramSearchKind)
        handleSetKind(paramSearchKind)
      }

      const nativeApp: IOpenAppNostr = {
        naddr: NATIVE_NADDR,
        url: 'nostr:' + getParamAddr,
        name: 'Native app',
        about: 'Any native Nostr app installed on your device',
        picture: '',
        lastUsed: false,
        pinned: false,
        order: 0
      }

      let lastAppNaddr = ''
      let lastKindApp: IOpenAppNostr | null = null

      if (paramSearchKind && currentWorkSpace) {
        const app = currentWorkSpace?.lastKindApps[paramSearchKind]
        const addr = parseAddr(getParamAddr)
        if (app && app.urls && addr) {
          if (!addr.kind) addr.kind = Number(paramSearchKind)

          lastKindApp = {
            ...app,
            url: getHandlerEventUrl(app, addr),
            order: 10000,
            lastUsed: true,
          }
          lastAppNaddr = app.naddr || ''
        }
      }

      if (lastKindApp && lastKindApp.naddr !== NATIVE_NADDR)
        setApps([lastKindApp, nativeApp])
      else
        setApps([nativeApp])

      const [info, addr] = await fetchAppsForEvent(getParamAddr)

      if (addr.kind === undefined) {
        setIsAppsLoading(false)
        return
      }

      setKind(`${addr.kind}`)
      handleSetKind(`${addr.kind}`)

      if (currentWorkSpace && addr.kind in currentWorkSpace.lastKindApps) {
        lastAppNaddr = currentWorkSpace?.lastKindApps[addr.kind].naddr || ''
      }

      const apps: IOpenAppNostr[] = []
      if (lastKindApp && lastKindApp.naddr !== NATIVE_NADDR) {
        apps.push(lastKindApp)
      }

      apps.push({
        ...nativeApp,
        lastUsed: NATIVE_NADDR === lastAppNaddr,
        order: NATIVE_NADDR === lastAppNaddr ? 10000 : 9999
      })

      for (const [, appHandlers] of info.apps) {
        const app = appHandlers.handlers[0]
        if (!app.eventUrl) continue

        if (app.naddr === lastAppNaddr) continue

        const pinned = !!findAppPin(app)

        const lastUsed = app.naddr === lastAppNaddr

        let order = app.order
        // last app always at the topw
        if (lastUsed) order = 10000
        // // pinned are a priority
        else if (pinned) order += 1000

        let hostname = ''
        try {
          const url = new URL(app.eventUrl)
          hostname = url.hostname
        } catch (e) {
          console.log('bad app eventUrl', app.eventUrl)
          continue
        }

        apps.push({
          naddr: app.naddr,
          url: app.eventUrl,
          name: app.meta?.display_name || app.meta?.name || hostname,
          about: app.meta?.about || '',
          picture: app.meta?.picture || '',
          urls: app.urls,
          lastUsed,
          pinned,
          order
        })
      }

      apps.sort((a, b) => b.order - a.order)

      // only native?
      if (apps.length === 1) {
        setIsAppsFailed(true)
      }
      setApps(apps)
      setIsAppsLoading(false)
    } catch (error) {
      console.log('error', error)
      setIsAppsLoading(false)
      setIsAppsFailed(true)
    }
  }, [currentWorkSpace?.lastKindApps, currentWorkSpace?.pins, getParamAddr, paramSearchKind])

  const resetStates = useCallback(() => {
    setApps([])
    setKind('')
    handleSetKind('')
    setSearchValue('')
  }, [])

  const handleOpen = (app: IOpenAppNostr) => {
    openApp({ ...app, kind }, { replace: true })
  }

  useEffect(() => {
    resetStates()
    if (getParamAddr) {
      load()
    }
  }, [getParamAddr, load])

  const renderContent = () => {
    return (
      <>
        <Container>
          <StyledForm>
            <Input
              endAdornment={
                <IconButton color="inherit" size="medium" onClick={() => copyToClipBoard(getParamAddr)}>
                  <ContentCopyIcon />
                </IconButton>
              }
              readOnly
              value={getParamAddr}
            />
            <Input
              placeholder="Search app"
              endAdornment={
                <IconButton color="inherit" size="medium">
                  <SearchOutlinedIcon />
                </IconButton>
              }
              onChange={handleChange}
              value={searchValue}
              inputProps={{
                autoFocus: false
              }}
            />
          </StyledForm>
        </Container>

        <Container>
          {filteredApps.map((app, index) => {
            return <AppNostroListItem app={app} key={index} onClick={() => handleOpen(app)} />
          })}
        </Container>
        {(isAppsFailed || !filteredApps.length) && !isAppsLoading && (
          <StyledNoAppsMessage message="No apps" onReload={load} />
        )}
        {isAppsLoading && (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        )}
      </>
    )
  }

  return <>{renderContent()}</>
}
