import { FC, ReactNode, useCallback, useState } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import { StyledItemIconAvatar, StyledItemText, StyledMenuWrapper } from './styled'
import { List, ListItem, ListItemAvatar, ListItemButton } from '@mui/material'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { AppEvent } from '@/types/app-event'
import { showToast } from '@/utils/helpers/general'
import { useOpenApp } from '@/hooks/open-entity'
import { usePins } from '@/hooks/pins'
import { getDomain } from '@/utils/helpers/prepare-data'
import { AugmentedEvent } from '@/types/augmented-event'

type ModalAppOfTheDayContentProps = {
  handleClose: () => void
}

export const ModalAppOfTheDayContent: FC<ModalAppOfTheDayContentProps> = ({ handleClose }) => {
  // @TODO show app info
  const { openBlank } = useOpenApp()
  const { onPinApp } = usePins()
  const [event, setEvent] = useState<AugmentedEvent | null>(null)

  const handleLaunchApp = () => {
    const url = (event as AppEvent).meta?.website
    if (!url) {
      showToast('App url not specified!')
      return
    }
    openBlank({ url }, { replace: true })
  }
  const handleZap = async () => {
    const url = `https://zapper.nostrapps.org/zap?id=${b32}`
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
  return (
    <Container>
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
