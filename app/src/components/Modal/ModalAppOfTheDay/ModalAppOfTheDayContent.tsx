import { FC, ReactNode, useCallback, useEffect } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import {
  StyledAppDescription,
  StyledAppName,
  StyledDetailItem,
  StyledDetailsContainer,
  StyledInput,
  StyledItemIconAvatar,
  StyledItemText,
  StyledMenuWrapper
} from './styled'
import { List, ListItem, ListItemAvatar, ListItemButton, Stack, IconButton } from '@mui/material'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
//import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
//import { showToast } from '@/utils/helpers/general'
import { useOpenApp } from '@/hooks/open-entity'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'
import { useAppSelector } from '@/store/hooks/redux'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import MenuIcon from '@mui/icons-material/Menu'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { kindNames } from '@/consts'

type ModalAppOfTheDayContentProps = {
  handleClose: () => void
  handleHideWidget: () => void
}

const IGNORED_KINDS = [0, 1, 2, 3, 4, 5, 6, 7]

export const ModalAppOfTheDayContent: FC<ModalAppOfTheDayContentProps> = ({ handleClose }) => {
  const { appOfTheDay } = useAppSelector((state) => state.notifications)

  const { picture = '', name = '', naddr = '', url = '', about = '', kinds = [] } = appOfTheDay || {}

  const filteredKinds = kinds.filter((kind) => !IGNORED_KINDS.some((k) => k === kind))

  const renderKinds = () => {
    return filteredKinds
      .map((kind) => {
        const kindName = kindNames[kind]
        return kindName || kind
      })
      .join(' ')
  }

  const { openBlank } = useOpenApp()
  const { handleOpenContextMenu } = useOpenModalSearchParams()

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

  const handleLaunchApp = () => {
    openBlank({ url }, { replace: false })
  }
  const handleZap = async () => {
    const url = `https://zapper.nostrapps.org/zap?id=${naddr}`
    openBlank({ url }, { replace: false })
  }

  const handleReviewApp = async () => {
    const url = `https://nostrapp.link/a/${naddr}/review`
    openBlank({ url }, { replace: false })
  }

  // const handlePinApp = () => {
  //   onPinApp({
  //     url,
  //     naddr, //: app.naddr,
  //     name, //app.meta?.display_name || app.meta?.display_name || getDomain(url),
  //     picture, //: app.meta?.picture || '',
  //     order: 0
  //   }).then(handleHideWidget)
  //   showToast('Pinned!')
  //   handleClose()
  // }

  const handleCopyValue = () => {
    copyToClipBoard(url)
  }

  const handleAppMenuClick = () => {
    handleOpenContextMenu({ bech32: naddr })
  }

  return (
    <Container>
      <Stack gap={'0.5rem'} alignItems={'center'}>
        <AppIcon size={'large'} picture={picture} alt={name} />
        <StyledAppName>{name}</StyledAppName>
        <StyledAppDescription>{about}</StyledAppDescription>
        <StyledDetailsContainer>
          {/* <StyledDetailItem detailTitle="URL:">{url}</StyledDetailItem> */}
          <StyledInput
            endAdornment={
              <IconButton color="inherit" size="medium" onClick={handleCopyValue}>
                <ContentCopyOutlinedIcon />
              </IconButton>
            }
            readOnly
            value={url}
          />
          {filteredKinds.length > 0 && <StyledDetailItem detailTitle="Kinds:">{renderKinds()}</StyledDetailItem>}
        </StyledDetailsContainer>
      </Stack>
      <StyledMenuWrapper>
        <List>
          {renderItem('Launch', <PlayCircleOutlineOutlinedIcon />, handleLaunchApp)}
          {/* {renderItem('Pin', <PushPinOutlinedIcon />, handlePinApp)} */}
          {renderItem('Review', <StarHalfOutlinedIcon />, handleReviewApp)}
          {renderItem('Zap', <FlashOnIcon />, handleZap)}
          {renderItem('More...', <MenuIcon />, handleAppMenuClick)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
