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
import { IOpenAppNostro } from '@/types/app-nostro'
import { AppNostroListItem } from '@/shared/AppNostroListItem/AppNostroListItem'
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'

export const ModalSelectApp = () => {
  const { openApp } = useOpenApp()
  const [searchValue, setSearchValue] = useState('')
  const [kind, setKind] = useState('')
  const [apps, setApps] = useState<IOpenAppNostro[]>([])
  const [isAppsLoading, setIsAppsLoading] = useState(false)
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
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
      const info = await fetchAppsForEvent(getParamAddr)

      setKind(info.addr.kind)

      const apps: IOpenAppNostro[] = []
      for (const id in info.apps) {
        const app = info.apps[id].handlers[0]
        if (!app.eventUrl) continue

        const pinned = currentWorkSpace.pins.find((p) => p.appNaddr === app.naddr)

        // const lastUsed = app.naddr === lastAppNaddr;

        const order = app.order
        // last app always at the top
        // if (lastUsed) order = 1000;
        // // pinned are a priority
        // else if (pinned) order += 100;

        apps.push({
          naddr: app.naddr,
          url: app.eventUrl,
          name: app.profile?.display_name || app.profile?.name,
          about: app.profile?.about || '',
          picture: app.profile?.picture,
          // lastUsed,
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
  }, [currentWorkSpace.pins, getParamAddr])

  const handleOpen = (app: IOpenAppNostro) => {
    openApp({ ...app, kind }, { replace: true })
    // handleClose()
    setApps([])
    setKind('')
    setSearchValue('')
    // setSearchParams('')
  }

  useEffect(() => {
    if (getParamAddr) {
      load()
    }
  }, [getParamAddr, load])

  const copyAddrHandler = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.cordova.plugins.clipboard.copy(getParamAddr)
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
              placeholder="Search"
              endAdornment={
                <IconButton color="inherit" size="medium">
                  <SearchOutlinedIcon />
                </IconButton>
              }
              onChange={handleChange}
              value={searchValue}
              inputProps={{
                autoFocus: true
              }}
            />
            <StyledInput
              endAdornment={
                <IconButton color="inherit" size="medium" onClick={copyAddrHandler}>
                  <ContentCopyIcon />
                </IconButton>
              }
              readOnly
              defaultValue={getParamAddr}
            />
          </StyledForm>
        </Container>

        <Container>
          {filteredApps.map((app) => {
            return <AppNostroListItem app={app} key={app.url} onClick={() => handleOpen(app)} />
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
