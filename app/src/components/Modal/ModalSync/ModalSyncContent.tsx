import { Container } from '@/layout/Container/Conatiner'
import { StyledViewTitle, StyledWrap } from './styled'
import { useAppSelector } from '@/store/hooks/redux'
import { CircularProgressWithLabel } from './CircularProgressWithLabel'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'

export const ModalSyncContent = () => {
  const { syncState } = useAppSelector(state => state.sync)

  const progress = 100 * syncState.done / (syncState.todo + syncState.done)

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
          New events: {syncState.newEventCount}
        </StyledViewTitle>
        <StyledViewTitle>
          Total events: {syncState.totalEventCount}
        </StyledViewTitle>
      </StyledWrap>
    </Container>
  )
}
