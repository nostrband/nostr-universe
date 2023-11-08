import { ReactNode, useCallback } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import { StyledItemIconAvatar, StyledItemText, StyledMenuWrapper, StyledViewTitle, StyledWrap } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { CircularProgressWithLabel } from './CircularProgressWithLabel'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined'
import { resync } from '@/modules/sync'
import { List, ListItem, ListItemAvatar, ListItemButton } from '@mui/material'

export const ModalSyncContent = () => {
  const { syncState } = useAppSelector(state => state.sync)
  const { currentPubkey } = useAppSelector(state => state.keys)

  const progress = 100 * syncState.done / (syncState.todo + syncState.done)

  const fullSyncHandler = () => {
    resync(currentPubkey)
  }

  const renderItem = useCallback((label: string, icon: ReactNode, handler: () => void, danger: boolean = false) => {
    return (
      <ListItem disablePadding>
        <ListItemButton alignItems="center" onClick={handler}>
          <ListItemAvatar>
            <StyledItemIconAvatar danger={danger}>{icon}</StyledItemIconAvatar>
          </ListItemAvatar>
          <StyledItemText primary={label} />
        </ListItemButton>
      </ListItem>
    )
  }, [])

  return (
    <Container>
      <StyledWrap>
        <StyledViewTitle variant="h5">
          {syncState.todo > 0 && (
            <>Loading new events...</>
          )}
          {!syncState.todo && (
            <>Done loading events</>
          )}
        </StyledViewTitle>

        {syncState.todo > 0 && (
          <CircularProgressWithLabel value={progress} />
        )}
        {!syncState.todo && (
          <StyledViewTitle variant="h4">
            <CheckCircleOutlinedIcon />
          </StyledViewTitle>
        )}
        <StyledViewTitle>
          Received events: {syncState.newEventCount}
        </StyledViewTitle>
        <StyledViewTitle>
          Total events: {syncState.totalEventCount}
        </StyledViewTitle>

      </StyledWrap>
      <StyledMenuWrapper>
        <List>
          {renderItem('Full sync', <CloudSyncOutlinedIcon />, fullSyncHandler)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
