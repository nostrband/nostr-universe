import { useState, useEffect } from 'react'
import { Dialog, Grid, TextField } from '@mui/material'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Container } from '@/layout/Container/Conatiner'
import { StyledAutocomplete, StyledDatePicker, StyledFilterField, StyledInput, StyledWrapDialogContent } from './styled'
import { SignedEvent } from './SignedEvent'
import { dbi } from '@/modules/db'
import { Input } from '@/shared/Input/Input'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { KindOptionType, formatDate, getTransformedKindEvents } from '@/consts'
import { addDays, isAfter, isEqual, isWithinInterval, startOfDay } from 'date-fns'

// const eventsMoc = [
//   {
//     id: '1',
//     url: 'http://www.google.com/3434343/',
//     kind: '1',
//     timestamp: 1696603164903,
//     eventJson: 'some json 1 test',
//     eventId: 'some event 1',
//     pubkey: 'pubkey'
//   },
//   {
//     id: '2',
//     url: 'http://www.test.com/3434343/',
//     kind: '30001',
//     timestamp: 1696603164903,
//     eventJson: 'some json 2',
//     eventId: 'some event 2',
//     pubkey: 'pubkey'
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
  const { handleOpen } = useOpenModalSearchParams()
  const [content, setContent] = useState('')
  const [events, setEvents] = useState([])
  const [kinds, setKinds] = useState<KindOptionType[]>([])
  const [startDate, setStartDate] = useState<Date | null>(startOfDay(new Date()))
  const [endDate, setEndDate] = useState<Date | null>(null)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterContentValue(e.target.value)
  }

  const handleKindChange = (_: React.SyntheticEvent<Element, Event>, newValue: unknown) => {
    setKinds(newValue as KindOptionType[])
  }

  const handleChangeDateStart = (e: unknown) => {
    if (e) {
      const createStartDate = startOfDay(e as Date)

      if (endDate) {
        if (isAfter(createStartDate, endDate) || isEqual(createStartDate, endDate)) {
          setStartDate(createStartDate)
          setEndDate(null)
        } else {
          setStartDate(createStartDate)
        }
      } else {
        setStartDate(createStartDate)
      }
    } else {
      setStartDate(e as null)
    }
  }

  const handleChangeDateEnd = (e: unknown) => {
    if (e) {
      setEndDate(startOfDay(e as Date))
    } else {
      setEndDate(e as null)
    }
  }

  const filteredEvents: TypeSignEvent[] = events.filter((event: TypeSignEvent) => {
    const filteredByEventsAndUrl =
      event.eventJson.toLowerCase().includes(filterContentValue.toLowerCase()) ||
      event.url.toLowerCase().includes(filterContentValue.toLowerCase())

    const filteredByKind = kinds.length ? kinds.some((kind) => kind.kind === String(event.kind)) : true

    let filteredByDate = true

    if (startDate) {
      if (endDate) {
        filteredByDate = isWithinInterval(startOfDay(new Date(event.timestamp)), { start: startDate, end: endDate })
      } else {
        filteredByDate = !isAfter(startDate, startOfDay(new Date(event.timestamp)))
      }
    }
    return filteredByEventsAndUrl && filteredByKind && filteredByDate
  })

  return (
    <Container>
      <StyledFilterField>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DemoContainer components={['MobileDatePicker']}>
                <DemoItem>
                  <StyledDatePicker
                    format={formatDate}
                    closeOnSelect
                    onChange={handleChangeDateStart}
                    defaultValue={new Date()}
                    value={startDate}
                    componentsProps={{
                      actionBar: {
                        actions: ['clear', 'accept', 'cancel']
                      }
                    }}
                  />
                </DemoItem>
              </DemoContainer>
            </Grid>
            <Grid item xs={6}>
              <DemoContainer components={['MobileDatePicker']}>
                <DemoItem>
                  <StyledDatePicker
                    format={formatDate}
                    minDate={startDate && addDays(startDate, 1)}
                    closeOnSelect
                    value={endDate}
                    onChange={handleChangeDateEnd}
                    componentsProps={{
                      actionBar: {
                        actions: ['clear', 'accept', 'cancel']
                      }
                    }}
                  />
                </DemoItem>
              </DemoContainer>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </StyledFilterField>
      <StyledFilterField>
        <StyledAutocomplete
          multiple
          id="tags-standard"
          onChange={handleKindChange}
          options={getTransformedKindEvents}
          renderInput={(params) => <StyledInput {...params} placeholder="Kinds events" />}
        />
      </StyledFilterField>
      <StyledFilterField>
        <Input
          placeholder="Filter content"
          onChange={handleChange}
          value={filterContentValue}
          inputProps={{
            autoFocus: false
          }}
        />
      </StyledFilterField>
      {filteredEvents.map((event) => (
        <SignedEvent
          key={event.id}
          url={event.url}
          kind={event.kind}
          time={event.timestamp}
          eventId={event.eventId}
          eventJson={event.eventJson}
          handleShowContent={handleShowContent}
          handleOpen={handleOpen}
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
