import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import { StyledItemIconAvatar, StyledItemText, StyledMenuWrapper, StyledViewTitle, StyledWrap } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { CircularProgressWithLabel } from './CircularProgressWithLabel'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined'
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined'
import { List, ListItem, ListItemAvatar, ListItemButton } from '@mui/material'
import { worker } from '@/workers/client'

export const ModalSyncContent = () => {
  const { syncState } = useAppSelector((state) => state.sync)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const [isPaused, setIsPaused] = useState(false)
  const [eventCount, setEventCount] = useState(0)

  const progress = (100 * syncState.done) / (syncState.todo + syncState.done)

  const workerCallResync = async () => {
    await worker.syncResync(currentPubkey)
  }

  const workerCallPause = async () => {
    await worker.syncPause()
  }

  const workerCallResume = async () => {
    await worker.syncResume()
  }

  const fullSyncHandler = useCallback(() => {
    // resync(currentPubkey)
    workerCallResync()
    // actionWorker('start')
    // console.log('Worker res:', result)
  }, [currentPubkey])

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

  useEffect(() => {
    worker.syncIsPaused().then(setIsPaused)
    worker.relayGetEventsCount().then(setEventCount)
    worker.relayGetEventStats().then((stats) => console.log('sync stats', stats))
  }, [syncState])

  return (
    <Container>
      <StyledWrap>
        <StyledViewTitle variant="h5">
          {syncState.todo > 0 && <>Loading new events...</>}
          {!syncState.todo && <>Done loading events</>}
        </StyledViewTitle>

        {syncState.todo > 0 && <CircularProgressWithLabel value={progress} />}
        {!syncState.todo && (
          <StyledViewTitle variant="h4">
            <CheckCircleOutlinedIcon />
          </StyledViewTitle>
        )}
        <StyledViewTitle>Received events: {syncState.newEventCount}</StyledViewTitle>
        <StyledViewTitle>Stored events: {eventCount}</StyledViewTitle>
      </StyledWrap>
      <StyledMenuWrapper>
        <List>
          {renderItem('Full sync', <CloudSyncOutlinedIcon />, fullSyncHandler)}
          {!isPaused && renderItem('Pause sync', <PauseCircleOutlineOutlinedIcon />, workerCallPause)}
          {isPaused && renderItem('Resume sync', <PlayCircleFilledWhiteOutlinedIcon />, workerCallResume)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
