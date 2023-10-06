import { Button } from '@mui/material'
import { StyledViewTitle, StyledListItem, StyledList, StyledItemText, StyledListItemActions } from './styled'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'

interface ISignedEvent {
  url: string
  kind: string
  time: number
  id: string
  eventId: string
  eventJson: string
  handleShowContent: (content: string) => void
}

export const SignedEvent = ({ url, kind, time, id, eventId, eventJson, handleShowContent }: ISignedEvent) => {
  const handleCopyId = () => {
    copyToClipBoard(id)
  }

  const handleCopyEvent = () => {
    copyToClipBoard(eventId)
  }

  const handleShowDialogContent = () => {
    handleShowContent(eventJson)
  }

  return (
    <>
      <StyledViewTitle>{url}</StyledViewTitle>
      <StyledList dense>
        <StyledListItem>
          <StyledItemText primary="url" secondary={url} />
          <StyledItemText primary="kind" secondary={kind} />
          <StyledItemText primary="time" secondary={time} />
          <StyledListItemActions disablePadding>
            <Button
              fullWidth
              variant="contained"
              size="small"
              className="button"
              color="secondary"
              onClick={handleShowDialogContent}
            >
              Show
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="small"
              className="button"
              color="secondary"
              onClick={handleCopyId}
            >
              Copy id
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="small"
              className="button"
              color="secondary"
              onClick={handleCopyEvent}
            >
              Copy event
            </Button>
          </StyledListItemActions>
        </StyledListItem>
      </StyledList>
    </>
  )
}
