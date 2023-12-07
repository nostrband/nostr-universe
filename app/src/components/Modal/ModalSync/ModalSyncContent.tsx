import {ReactNode, useCallback, useEffect, useRef} from 'react'
import { Container } from '@/layout/Container/Conatiner'
import { StyledItemIconAvatar, StyledItemText, StyledMenuWrapper, StyledViewTitle, StyledWrap } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { CircularProgressWithLabel } from './CircularProgressWithLabel'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined'
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined'
import { resync, pauseSync, resumeSync, isSyncPaused } from '@/modules/sync'
import { List, ListItem, ListItemAvatar, ListItemButton } from '@mui/material'
import { getEventStats } from '@/modules/relay'
import worker_script from '../../../modules/syncWorker.ts'

export const ModalSyncContent = () => {
  const { syncState } = useAppSelector((state) => state.sync)
  const { currentPubkey } = useAppSelector((state) => state.keys)

  const progress = (100 * syncState.done) / (syncState.todo + syncState.done)




  // const worker = useRef(null);

  const startWorker = () => {
    const worker = new Worker(worker_script);

    worker.onmessage = (m) => {
      console.log("msg from worker: ", m.data);
    };
    worker.postMessage(currentPubkey);

    console.log('Результат:', worker)
    // if (worker.current) {
    //   console.log('startWorker 1')
    //   worker.current.postMessage('start');
    // } else {
    //
    //   worker.current = new Worker('../../../modules/syncWorker.ts');
    //   console.log('startWorker 2', worker.current)
    //   worker.current.onmessage = function(event) {
    //     // Получаем результат от воркера
    //     console.log('Результат:', event.data);
    //     // Здесь можно обновить состояние компонента с полученными данными
    //   };
    //
    //   worker.current.postMessage('start');
    // }
  };




  const fullSyncHandler = useCallback(() => {
    // resync(currentPubkey)
    startWorker()
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
    const stats = getEventStats()
    console.log('sync stats', stats)
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
        <StyledViewTitle>Stored events: {syncState.totalEventCount}</StyledViewTitle>
      </StyledWrap>
      <StyledMenuWrapper>
        <List>
          {renderItem('Full sync', <CloudSyncOutlinedIcon />, fullSyncHandler)}
          {!isSyncPaused() && renderItem('Pause sync', <PauseCircleOutlineOutlinedIcon />, pauseSync)}
          {isSyncPaused() && renderItem('Resume sync', <PlayCircleFilledWhiteOutlinedIcon />, resumeSync)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
