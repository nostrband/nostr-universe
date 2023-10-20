import { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Container } from '@/layout/Container/Conatiner'
import { StyledDatePicker, StyledFilterField } from './styled'
import { PaymentItem } from './PaymentItem'
import { dbi } from '@/modules/db'
import { Input } from '@/shared/Input/Input'
import { useAppSelector } from '@/store/hooks/redux'
import { formatDate } from '@/consts'
import { addDays, isAfter, isEqual, isWithinInterval, startOfDay } from 'date-fns'
import { MetaEvent } from '@/types/meta-event'
import { getTagValue } from '@/modules/nostr'

// const paymentsMoc: TypePayment[] = [
//   {
//     id: '1',
//     walletId: '11',
//     url: 'http://www.pay.com/3434343/',
//     timestamp: 1697539587019,
//     walletName: 'Wallet 1',
//     amount: 100,
//     invoice: 'invoice 1',
//     preimage: 'preimage 1',
//     pubkey: 'pubkey'
//   },
//   {
//     id: '2',
//     walletId: '22',
//     url: 'http://www.pay.com/65656566/',
//     timestamp: 1697539587019,
//     walletName: 'Wallet 2',
//     amount: 10,
//     invoice: 'invoice 2',
//     preimage: '',
//     pubkey: 'pubkey'
//   }
// ]

type TypePayment = {
  id: string
  pubkey: string
  walletId: string
  url: string
  timestamp: number
  walletName: string
  amount: number
  invoice: string
  preimage: string
  descriptionHash: string
  receiverPubkey: string
  receiver?: MetaEvent
}

export const ModalPaymentHistoryContent = () => {
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const [payments, setPayments] = useState<TypePayment[]>([])
  const [startDate, setStartDate] = useState<Date | null>(startOfDay(new Date()))
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [filterContentValue, setFilterContentValue] = useState('')
  const [filterAmount, setFilterAmount] = useState<string | number>('')

  const getPayments = async () => {
    try {
      const res = await dbi.listPayments(currentPubkey) as TypePayment[]
      const zaps = await dbi.listSignedZapRequests(currentPubkey)

      // attach zaps
      res.forEach((p: TypePayment) => {
        const zap = zaps.find((z: any) => z.eventZapHash === p.descriptionHash)
        if (zap) {
          try {
            const event = JSON.parse(zap.eventJson)
            p.receiverPubkey = getTagValue(event, 'p') || ''
          } catch {}
        }
      })

      setPayments(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPayments()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterContentValue(e.target.value)
  }

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAmount(e.target.value)
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

  const getFieldСoincidence = (field: string) => field.toLowerCase().includes(filterContentValue.toLowerCase())

  const filteredPayments: TypePayment[] = payments.filter((payment: TypePayment) => {
    const filteredByFields =
      getFieldСoincidence(payment.invoice) ||
      getFieldСoincidence(payment.url) ||
      getFieldСoincidence(payment.walletName) ||
      getFieldСoincidence(payment.preimage)

    const filteredByAmount = payment.amount >= Number(filterAmount) * 1000

    let filteredByDate = true

    if (startDate) {
      if (endDate) {
        filteredByDate = isWithinInterval(startOfDay(new Date(payment.timestamp)), { start: startDate, end: endDate })
      } else {
        filteredByDate = !isAfter(startDate, startOfDay(new Date(payment.timestamp)))
      }
    }
    return filteredByFields && filteredByAmount && filteredByDate
  })

  return (
    <Container>
      <StyledFilterField sx={{ marginTop: 1 }}>
        <Input
          placeholder="Filter minimal amount"
          onChange={handleChangeAmount}
          value={filterAmount}
          type="number"
          inputProps={{
            autoFocus: false
          }}
        />
      </StyledFilterField>
      <StyledFilterField>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={0} marginTop="-8px">
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
        <Input
          placeholder="Filter content"
          onChange={handleChange}
          value={filterContentValue}
          inputProps={{
            autoFocus: false
          }}
        />
      </StyledFilterField>
      {filteredPayments.map((payment) => (
        <PaymentItem
          key={payment.id}
          url={payment.url}
          time={payment.timestamp}
          walletName={payment.walletName}
          amount={payment.amount}
          preimage={payment.preimage}
          receiverPubkey={payment.receiverPubkey}
          receiver={payment.receiver}
        />
      ))}
    </Container>
  )
}
