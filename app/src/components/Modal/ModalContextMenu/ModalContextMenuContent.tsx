import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { Container } from '@/layout/Container/Conatiner'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import OpenInBrowserOutlinedIcon from '@mui/icons-material/OpenInBrowserOutlined'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined'
import {
  StyledListItemAppIcon,
  StyledInput,
  StyledItemIconAvatar,
  StyledItemText,
  StyledMenuWrapper,
  StyledItemIconButton,
  StyledItemEventPreview
} from './styled'
import { IconButton, List, ListItem, ListItemAvatar, ListItemButton } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import {
  fetchExtendedEventByBech32,
  getHandlerEventUrl,
  getTagValue,
  parseAddr,
  stringToBech32,
  stringToBolt11
} from '@/modules/nostr'
import { useOpenApp } from '@/hooks/open-entity'
import { copyToClipBoard, getDomain } from '@/utils/helpers/prepare-data'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { AppEvent } from '@/types/app-event'
import { showToast } from '@/utils/helpers/general'
import { usePins } from '@/hooks/pins'
import { selectCurrentWorkspace, selectKeys } from '@/store/store'
import { AppNostr } from '@/types/app-nostr'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { Kinds } from '@/modules/const/kinds'
import { AuthoredEvent } from '@/types/authored-event'
import { ItemEventMultipurpose } from '@/components/ItemsEventContent/ItemEventMultipurpose/ItemEventMultipurpose'
import { ItemEventProfile } from '@/components/ItemsEventContent/ItemEventProfile/ItemEventProfile'
import { dbi } from '@/modules/db'
import { setSelectAppHistory } from '@/store/reducers/selectAppHistory.slice'

export const ModalContextMenuContent = () => {
  const [searchParams] = useSearchParams()
  const { currentPubkey } = useAppSelector(selectKeys)
  const dispatch = useAppDispatch()
  const { handleOpen, handleClose } = useOpenModalSearchParams()
  const { openApp, openBlank, sendTabPayment } = useOpenApp()
  const { onPinApp, findAppPin, onDeletePinnedApp } = usePins()
  const [kind, setKind] = useState<number | undefined>()
  const [event, setEvent] = useState<AuthoredEvent | null>(null)
  const [lastApp, setLastApp] = useState<AppNostr | null>(null)
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const tabId = searchParams.get('tabId') || ''
  const tabUrl = searchParams.get('tabUrl') || ''
  const text = searchParams.get('text') || ''
  const href = searchParams.get('href') || ''
  const imgSrc = searchParams.get('imgSrc') || ''
  const videoSrc = searchParams.get('videoSrc') || ''
  const audioSrc = searchParams.get('audioSrc') || ''
  let value = searchParams.get('bech32') || href || text || imgSrc || videoSrc || audioSrc
  const b32 = stringToBech32(value || tabUrl)
  const [invoice] = stringToBolt11(value || tabUrl)
  if (!value) value = b32 || invoice || tabUrl // from tabUrl
  const isApp = kind === Kinds.APP
  const pin = event && isApp ? findAppPin(event as AppEvent) : null
  const addr = b32 ? parseAddr(b32) : undefined
  if (addr && kind !== undefined) addr.kind = kind

  useEffect(() => {
    setLastApp(null)
    if (addr && kind !== undefined) {
      const app = currentWorkSpace?.lastKindApps[kind] || null
      if (app) {
        const url = getHandlerEventUrl(app, addr)
        setLastApp({
          ...app,
          url
        })
      }
      console.log('last app', app)
    }
  }, [kind])

  useEffect(() => {
    if (addr?.kind !== undefined) setKind(addr?.kind)
    else setKind(undefined)

    setEvent(null)
    if (b32) {
      const load = async () => {
        const event = await fetchExtendedEventByBech32(b32, contactList?.contactPubkeys)
        setEvent(event)
        setKind(event?.kind)
      }
      load()
    }
  }, [b32])

  const handleOpenModalSelect = () => {
    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
      search: {
        [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: b32,
        [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(kind || '')
      },
      replace: true
    })
  }

  const handleOpenApp = async () => {
    if (!lastApp) return
    // open the tab first
    openApp({ ...lastApp, kind: '' + kind }, { replace: true })

    // then write to db in the background
    const app = await dbi.addSelectAppHistory({
      kind,
      naddr: lastApp.naddr,
      pubkey: currentPubkey,
      timestamp: Date.now(),
      name: lastApp.name,
      nextSuggestTime: Date.now(),
      numberOfLaunch: 1
    })
    dispatch(setSelectAppHistory({ apps: [app] }))
  }

  const handleZap = async () => {
    const url = `https://zapper.nostrapps.org/zap?id=${b32}`
    openBlank({ url }, { replace: true })
  }

  const handleReplies = async () => {
    const url = `https://replies.nostrapps.org/?id=${b32}`
    openBlank({ url }, { replace: true })
  }

  const handleReviewApp = async () => {
    const url = `https://nostrapp.link/a/${b32}/review`
    openBlank({ url }, { replace: true })
  }

  const handleShareTabUrl = async () => {
    await handleClose()
    window.navigator.share({ url: tabUrl })
  }

  const handleShareValue = async () => {
    await handleClose()
    window.navigator.share({ text: value })
  }

  const handleCopyValue = () => {
    copyToClipBoard(value)
  }

  const handleOpenHref = () => {
    openBlank({ url: href }, { replace: true })
  }

  const handleOpenTabUrlIntent = () => {
    openBlank({ url: 'intent:' + tabUrl }, {})
  }

  const handleOpenHrefIntent = () => {
    openBlank({ url: 'intent:' + href }, {})
  }

  const handlePayInvoice = async () => {
    await handleClose()
    sendTabPayment(tabId, invoice)
  }

  const handleLaunchApp = () => {
    const url = (event as AppEvent).meta?.website
    if (!url) {
      showToast('App url not specified!')
      return
    }
    openBlank({ url }, { replace: true })
  }

  const handlePinApp = () => {
    const app = event as AppEvent
    const url = app.meta?.website
    if (!url) {
      showToast('App url not specified!')
      return
    }
    onPinApp({
      url,
      naddr: app.naddr,
      name: app.meta?.display_name || app.meta?.display_name || getDomain(url),
      picture: app.meta?.picture || '',
      order: 0
    })
    showToast('Pinned!')
    handleClose()
  }

  const handleUnpinApp = () => {
    if (!pin) return
    onDeletePinnedApp(pin)
    handleClose()
  }

  const renderItem = useCallback((label: string, icon: ReactNode, handler: () => void) => {
    return (
      <ListItem disablePadding>
        <ListItemButton alignItems="center" onClick={handler}>
          <ListItemAvatar>
            <StyledItemIconAvatar>{icon}</StyledItemIconAvatar>
          </ListItemAvatar>
          <StyledItemText primary={label} />
        </ListItemButton>
      </ListItem>
    )
  }, [])

  const renderOpenWith = useCallback(() => {
    return (
      <ListItem
        disablePadding
        secondaryAction={
          lastApp && (
            <StyledItemIconButton edge="end" aria-label="more" onClick={handleOpenModalSelect}>
              <MoreHorizOutlinedIcon />
            </StyledItemIconButton>
          )
        }
      >
        <ListItemButton alignItems="center" onClick={lastApp ? handleOpenApp : handleOpenModalSelect}>
          {!lastApp && (
            <ListItemAvatar>
              <StyledItemIconAvatar>
                <AppsOutlinedIcon />
              </StyledItemIconAvatar>
            </ListItemAvatar>
          )}
          {lastApp && (
            <StyledListItemAppIcon>
              <AppIcon isPreviewTab isRounded={true} picture={lastApp.picture} alt={lastApp.name} />
            </StyledListItemAppIcon>
          )}
          <StyledItemText primary={lastApp ? 'Open with ' + lastApp.name : 'Open with'} />
        </ListItemButton>
      </ListItem>
    )
  }, [lastApp])

  const getPreviewComponentEvent = (eventCurrent: AuthoredEvent | null) => {
    if (eventCurrent) {
      switch (eventCurrent.kind) {
        case 0: {
          const profileEvent = {
            author: eventCurrent.author,
            pubkey: eventCurrent.pubkey,
            content: eventCurrent.author?.profile?.about,
            website: eventCurrent.author?.profile?.website,
            kind: eventCurrent.kind
          }

          return <ItemEventProfile event={profileEvent} />
        }
        case 1: {
          const postEvent = {
            author: eventCurrent.author,
            pubkey: eventCurrent.pubkey,
            time: eventCurrent.created_at,
            content: eventCurrent.content,
            kind: eventCurrent.kind
          }

          return <ItemEventMultipurpose event={postEvent} />
        }
        default: {
          const defaultEvent = {
            author: eventCurrent.author,
            pubkey: eventCurrent.pubkey,
            time: eventCurrent.created_at,
            kind: eventCurrent.kind,
            content:
              getTagValue(eventCurrent, 'summary') ||
              getTagValue(eventCurrent, 'description') ||
              getTagValue(eventCurrent, 'alt') ||
              eventCurrent.content,
            title: getTagValue(eventCurrent, 'title') || getTagValue(eventCurrent, 'name')
          }

          return <ItemEventMultipurpose event={defaultEvent} />
        }
      }
    }

    return null
  }

  return (
    <Container>
      {event ? <StyledItemEventPreview>{getPreviewComponentEvent(event)}</StyledItemEventPreview> : null}

      {value && (
        <StyledInput
          endAdornment={
            <IconButton color="inherit" size="medium" onClick={handleCopyValue}>
              <ContentCopyOutlinedIcon />
            </IconButton>
          }
          readOnly
          value={value || ''}
        />
      )}
      <StyledMenuWrapper>
        <List>
          {invoice && renderItem('Pay invoice', <AccountBalanceWalletOutlinedIcon />, handlePayInvoice)}
          {isApp && renderItem('Launch app', <PlayCircleOutlineOutlinedIcon />, handleLaunchApp)}
          {isApp && !pin && renderItem('Pin app', <PushPinOutlinedIcon />, handlePinApp)}
          {isApp && !!pin && renderItem('Unpin app', <DeleteOutlineOutlinedIcon />, handleUnpinApp)}
          {isApp && renderItem('Review app', <StarHalfOutlinedIcon />, handleReviewApp)}
          {b32 && renderOpenWith()}
          {b32 && renderItem('Zap', <FlashOnIcon />, handleZap)}
          {b32 && renderItem('View replies', <ForumOutlinedIcon />, handleReplies)}
          {href && renderItem('Open in new tab', <OpenInNewOutlinedIcon />, handleOpenHref)}
          {href && renderItem('Open in browser', <OpenInBrowserOutlinedIcon />, handleOpenHrefIntent)}
          {value && renderItem('Share value', <ShareOutlinedIcon />, handleShareValue)}
          {tabId && renderItem('Share tab URL', <IosShareOutlinedIcon />, handleShareTabUrl)}
          {tabId && renderItem('Open tab URL in browser', <OpenInBrowserOutlinedIcon />, handleOpenTabUrlIntent)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
