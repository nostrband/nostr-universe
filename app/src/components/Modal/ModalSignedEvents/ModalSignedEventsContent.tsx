import { useState, useEffect } from 'react'
import { Dialog, TextField } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { StyledWrapDialogContent } from './styled'
import { SignedEvent } from './SignedEvent'
import { dbi } from '@/modules/db'
import { Input } from '@/shared/Input/Input'
import { useAppSelector } from '@/store/hooks/redux'

// const eventsMoc = [
//   {
//     id: '1',
//     url: 'some url 1',
//     kind: 'some kind 1',
//     time: '10:30',
//     eventJson: 'some json 1',
//     eventId: 'some event 1'
//   },
//   {
//     id: '2',
//     url: 'some url 2',
//     kind: 'some kind 2',
//     time: '20:30',
//     eventJson: 'some json 2',
//     eventId: 'some event 2'
//   }
// ]

type TypeSignEvent = {
  id: string
  pubkey: string
  timestamp: number
  url: string
  kind: string
  eventId: string
  eventJson: string
}

export const ModalSignedEventsContent = () => {
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const [content, setContent] = useState('')
  const [events, setEvents] = useState([])
  const [filterContentValue, setFilterContentValue] = useState('')
  const isShowDialog = Boolean(content)

  const handleCloseDialog = () => {
    setContent('')
  }

  const handleShowContent = (content: string) => {
    setContent(content)
  }

  const getEvents = async () => {
    try {
      const res = await dbi.getSignedEvents(currentPubkey)
      setEvents(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEvents()
  }, [])

  console.log(JSON.stringify({ events }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterContentValue(e.target.value)
  }

  const filteredEvents: TypeSignEvent[] = events.filter((event: TypeSignEvent) => {
    return event.eventJson.toLowerCase().includes(filterContentValue.toLowerCase())
  })

  return (
    <Container>
      <Input
        placeholder="Filter content"
        onChange={handleChange}
        value={filterContentValue}
        inputProps={{
          autoFocus: false
        }}
      />
      {filteredEvents.map((event) => (
        <SignedEvent
          key={event.id}
          id={event.id}
          url={event.url}
          kind={event.kind}
          time={event.timestamp}
          eventId={event.eventId}
          eventJson={event.eventJson}
          handleShowContent={handleShowContent}
        />
      ))}

      <Dialog fullWidth maxWidth="md" onClose={handleCloseDialog} open={isShowDialog}>
        <StyledWrapDialogContent>
          <TextField
            id="outlined-multiline-static"
            label="Event json"
            multiline
            fullWidth
            rows={20}
            defaultValue={content}
            InputProps={{
              readOnly: true
            }}
          />
        </StyledWrapDialogContent>
      </Dialog>
    </Container>
  )
}
