import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import {
  StyledAppDescription,
  StyledAppName,
  StyledDetailItem,
  StyledDetailsContainer,
  StyledItemIconAvatar,
  StyledItemText,
  StyledMenuWrapper
} from './styled'
import { List, ListItem, ListItemAvatar, ListItemButton, Stack } from '@mui/material'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { AppEvent } from '@/types/app-event'
import { showToast } from '@/utils/helpers/general'
import { useOpenApp } from '@/hooks/open-entity'
import { usePins } from '@/hooks/pins'
import { getDomain } from '@/utils/helpers/prepare-data'
import { AugmentedEvent } from '@/types/augmented-event'
import { useAppSelector } from '@/store/hooks/redux'
import { fetchExtendedEventByBech32, stringToBech32 } from '@/modules/nostr'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
// import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { kindNames } from '@/consts'

type ModalAppOfTheDayContentProps = {
  handleClose: () => void
  handleHideWidget: () => void
}

const IGNORED_KINDS = [0, 1, 2, 3, 4, 5, 6, 7]

export const ModalAppOfTheDayContent: FC<ModalAppOfTheDayContentProps> = ({ handleClose, handleHideWidget }) => {
  const { appOfTheDay } = useAppSelector((state) => state.notifications)
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)

  const { picture = '', name = '', naddr = '', url = '', about = '', kinds = [] } = appOfTheDay || {}

  const filteredKinds = kinds.filter((kind) => !IGNORED_KINDS.some((k) => k === kind))

  const renderKinds = () => {
    return filteredKinds
      .map((kind) => {
        const kindName = kindNames[kind]
        return kindName || kind
      })
      .join('')
  }

  const { openBlank } = useOpenApp()
  const { onPinApp } = usePins()
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const [event, setEvent] = useState<AugmentedEvent | null>(null)

  const b32 = stringToBech32(naddr)

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

  useEffect(() => {
    if (!appOfTheDay) {
      handleClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setEvent(null)
    if (b32) {
      const load = async () => {
        const event = await fetchExtendedEventByBech32(b32, contactList?.contactPubkeys)
        setEvent(event)
      }
      load()
    }
  }, [b32, contactList])

  const handleLaunchApp = () => {
    const url = (event as AppEvent).meta?.website
    if (!url) {
      showToast('App url not specified!')
      return
    }
    openBlank({ url }, { replace: true }).then(handleHideWidget)
  }
  const handleZap = async () => {
    if (naddr) {
      const b32 = stringToBech32(naddr)
      const url = `https://zapper.nostrapps.org/zap?id=${b32}`
      openBlank({ url }, { replace: true }).then(handleHideWidget)
    }
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
    }).then(handleHideWidget)
    showToast('Pinned!')
    handleClose()
  }

  // const handleCopyValue = () => {
  //   copyToClipBoard(url)
  // }

  const handleAppMenuClick = () => {
    handleOpenContextMenu({ bech32: naddr })
  }

  return (
    <Container>
      <Stack gap={'0.5rem'} alignItems={'center'}>
        <AppIcon size={'large'} picture={picture} alt={name} />
        <StyledAppName>{name}</StyledAppName>
        <StyledAppDescription>{about}</StyledAppDescription>
        {/* <StyledInput
          endAdornment={
            <IconButton color="inherit" size="medium" onClick={handleCopyValue}>
              <ContentCopyOutlinedIcon />
            </IconButton>
          }
          readOnly
          value={url}
        /> */}
        <StyledDetailsContainer>
          <StyledDetailItem detailTitle="URL:">{url}</StyledDetailItem>
          {filteredKinds.length > 0 && <StyledDetailItem detailTitle="Kinds:">{renderKinds()}</StyledDetailItem>}
        </StyledDetailsContainer>
      </Stack>
      <StyledMenuWrapper>
        <List>
          {renderItem('Launch app', <PlayCircleOutlineOutlinedIcon />, handleLaunchApp)}
          {renderItem('Pin app', <PushPinOutlinedIcon />, handlePinApp)}
          {renderItem('Zap', <FlashOnIcon />, handleZap)}
          {renderItem('App menu', <MenuIcon />, handleAppMenuClick)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
