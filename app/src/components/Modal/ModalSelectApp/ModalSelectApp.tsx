import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { IconButton } from '@mui/material'
import { fetchAppsForEvent } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenApp } from '@/hooks/open-entity'
import { StyledForm, StyledInput } from './styled'
import { IOpenAppNostr } from '@/types/app-nostr'
import { AppNostroListItem } from '@/shared/AppNostroListItem/AppNostroListItem'
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { NATIVE_NADDR } from '@/consts'

export const ModalSelectApp = () => {
  const { openApp } = useOpenApp()
  const [searchValue, setSearchValue] = useState('')
  const [kind, setKind] = useState('')
  const [apps, setApps] = useState<IOpenAppNostr[]>([])
  const [isAppsLoading, setIsAppsLoading] = useState(false)
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const currentWorkSpace = workspaces.find((workspace) => workspace.pubkey === currentPubKey)
  const [searchParams] = useSearchParams()
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.SELECT_APP)

  const paramSearchUrl = EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]
  const getParamAddr = searchParams.get(paramSearchUrl) || ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const filteredApps = apps.filter((app) => {
    return app.name.toLowerCase().includes(searchValue.toLowerCase())
  })

  const load = useCallback(async () => {
    try {
      setIsAppsLoading(true)
      const [info, addr] = await fetchAppsForEvent(getParamAddr)
      if (addr.kind === undefined) {
        setIsAppsLoading(false)
        return
      }

      setKind('' + addr.kind)

      const apps: IOpenAppNostr[] = []

      let lastAppNaddr = ''
      if (currentWorkSpace && addr.kind in currentWorkSpace.lastKindApps) {
        lastAppNaddr = currentWorkSpace?.lastKindApps[addr.kind]
      }

      apps.push({
        naddr: NATIVE_NADDR,
        url: 'nostr:' + getParamAddr,
        name: 'Native app',
        about: 'Any native Nostr app installed on your device',
        picture: '',
        lastUsed: NATIVE_NADDR === lastAppNaddr,
        pinned: false,
        order: NATIVE_NADDR === lastAppNaddr ? 1000 : 999
      })

      for (const [, appHandlers] of info.apps) {
        const app = appHandlers.handlers[0]
        if (!app.eventUrl) continue

        const pinned = currentWorkSpace?.pins.find((p) => p.appNaddr === app.naddr)

        const lastUsed = app.naddr === lastAppNaddr

        let order = app.order
        // last app always at the top
        if (lastUsed) order = 1000
        // // pinned are a priority
        else if (pinned) order += 100

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
          name: app.profile?.display_name || app.profile?.name || hostname,
          about: app.profile?.about || '',
          picture: app.profile?.picture || '',
          lastUsed,
          pinned: Boolean(pinned),
          order
        })
      }

      apps.sort((a, b) => b.order - a.order)

      setApps(apps)
      setIsAppsLoading(false)
    } catch (error) {
      setIsAppsLoading(false)
    }
  }, [currentWorkSpace?.lastKindApps, currentWorkSpace?.pins, getParamAddr])

  const resetStates = useCallback(() => {
    setApps([])
    setKind('')
    setSearchValue('')
  }, [])

  const handleOpen = (app: IOpenAppNostr) => {
    openApp({ ...app, kind }, { replace: true })
    // handleClose()
    resetStates()
    // setSearchParams('')
  }

  useEffect(() => {
    if (getParamAddr) {
      load()
    }
  }, [getParamAddr, load])

  useEffect(() => {
    return () => {
      resetStates()
    }
  }, [isOpen, resetStates])

  const copyAddrHandler = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.cordova.plugins.clipboard.copy(getParamAddr)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.plugins.toast.showShortBottom('Copied')
  }

  const renderContent = () => {
    if (isAppsLoading) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )
    }
    return (
      <>
        <Container>
          <StyledForm>
            <StyledInput
              endAdornment={
                <IconButton color="inherit" size="medium" onClick={copyAddrHandler}>
                  <ContentCopyIcon />
                </IconButton>
              }
              readOnly
              defaultValue={getParamAddr}
            />
            <StyledInput
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
      </>
    )
  }

  return (
    <Modal title="Select App" open={isOpen} handleClose={() => handleClose()}>
      {renderContent()}
    </Modal>
  )
}
