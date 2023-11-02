import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import { StyledItemIconAvatar, StyledItemText, StyledMenuWrapper } from './styled'
import { List, ListItem, ListItemAvatar, ListItemButton, Stack, Typography } from '@mui/material'
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

type ModalAppOfTheDayContentProps = {
  handleClose: () => void
}

export const ModalAppOfTheDayContent: FC<ModalAppOfTheDayContentProps> = ({ handleClose }) => {
  const { appOfTheDay } = useAppSelector((state) => state.notifications)
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)

  const { picture, name, naddr = '' } = appOfTheDay || {}

  const { openBlank } = useOpenApp()
  const { onPinApp } = usePins()
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

  // useEffect(() => {
  //   if (!appOfTheDay) {
  //     handleClose()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
    openBlank({ url }, { replace: true }).then(() => {
      handleClose()
    })
  }
  const handleZap = async () => {
    if (naddr) {
      const b32 = stringToBech32(naddr)
      const url = `https://zapper.nostrapps.org/zap?id=${b32}`
      openBlank({ url }, { replace: true }).then(() => {
        handleClose()
      })
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
    })
    showToast('Pinned!')
    handleClose()
  }

  return (
    <Container>
      <Stack flexDirection={'row'} gap={'0.5rem'}>
        <AppIcon size={'medium'} picture={picture} alt={name} />
        <Stack>
          <Typography variant="h6">{name}</Typography>
        </Stack>
      </Stack>
      <StyledMenuWrapper>
        <List>
          {renderItem('Launch app', <PlayCircleOutlineOutlinedIcon />, handleLaunchApp)}
          {renderItem('Pin app', <PushPinOutlinedIcon />, handlePinApp)}
          {renderItem('Zap', <FlashOnIcon />, handleZap)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
