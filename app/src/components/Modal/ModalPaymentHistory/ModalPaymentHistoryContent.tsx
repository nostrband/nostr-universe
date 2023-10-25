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
import { addDays, format, isAfter, isEqual, isWithinInterval, startOfDay } from 'date-fns'
import { MetaEvent } from '@/types/meta-event'
import { fetchMetas, getTagValue } from '@/modules/nostr'

// const paymentsMoc: TypePayment[] = [
//   {
//     id: '1',
//     walletId: '11',
//     url: 'http://www.pay.com/3434343/',
//     timestamp: 1698244639194,
//     walletName: 'Wallet 1',
//     amount: 100,
//     invoice: 'invoice 1',
//     preimage: 'preimage 1',
//     pubkey: 'pubkey',
//     descriptionHash: '556y56y56y56y56y5y56yy56',
//     receiverPubkey: 'eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f'
//   },
//   {
//     id: '2',
//     walletId: '22',
//     url: 'http://www.pay.com/65656566/',
//     timestamp: 1698244639194,
//     walletName: 'Wallet 2',
//     amount: 10,
//     invoice: 'invoice 2',
//     preimage: '',
//     pubkey: 'pubkey',
//     descriptionHash: '3r34r34r34r34r34r3',
//     receiverPubkey: '460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c'
//   },
//   {
//     id: '3',
//     walletId: '33',
//     url: 'http://www.pay.com/225225522222225/',
//     timestamp: 1698180374113,
//     walletName: 'Wallet 3',
//     amount: 150,
//     invoice: 'invoice 3',
//     preimage: 'preimage 3',
//     pubkey: 'pubkey',
//     descriptionHash: '556y56y56y56y56y5y56yy56',
//     receiverPubkey: 'eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f'
//   },
//   {
//     id: '4',
//     walletId: '44',
//     url: 'http://www.pay.com/225225522222225/',
//     timestamp: 1698180374113,
//     walletName: 'Wallet 4',
//     amount: 150,
//     invoice: 'invoice 4',
//     preimage: 'preimage 4',
//     pubkey: 'pubkey',
//     descriptionHash: '8838e83e38e38e38e38e38ej83je83',
//     receiverPubkey: ''
//   }
// ]

// const metaEventsMoc: MetaEvent[] = [
//   {
//     order: 1,
//     identifier: '1',
//     kind: 255,
//     tags: [['tag 1'], ['tag 2']],
//     content: 'content 1',
//     created_at: 1698244639194,
//     pubkey: 'eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f',
//     id: '1',
//     sig: '11',
//     profile: {
//       name: 'Lyn Alren',
//       picture: 'picture 1',
//       about: 'string',
//       nip05: 'string',
//       lud06: 'string',
//       lud16: 'string',
//       display_name: 'Lyn Alren',
//       website: 'string',
//       banner: 'string',
//       npub: 'string',
//       pubkey: 'eab0e756d32b80bcd464f3d844b8040303075a13eabc3599a762c9ac7ab91f4f'
//     }
//   },
//   {
//     order: 2,
//     identifier: '2',
//     kind: 255,
//     tags: [['tag 2'], ['tag 2']],
//     content: 'content 2',
//     created_at: 2698244639294,
//     pubkey: '460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c',
//     id: '2',
//     sig: '22',
//     profile: {
//       name: 'Vitor Pamplona',
//       picture: 'picture 2',
//       about: 'string',
//       nip05: 'string',
//       lud06: 'string',
//       lud16: 'string',
//       display_name: 'Vitor Pamplona',
//       website: 'string',
//       banner: 'string',
//       npub: 'string',
//       pubkey: '460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c'
//     }
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
      const res = (await dbi.listPayments(currentPubkey)) as TypePayment[]
      const zaps = await dbi.listSignedZapRequests(currentPubkey)

      // attach zaps
      res.forEach((p: TypePayment) => {
        // eslint-disable-next-line
        const zap = zaps.find((z: any) => z.eventZapHash === p.descriptionHash)
        if (zap) {
          try {
            const event = JSON.parse(zap.eventJson)
            p.receiverPubkey = getTagValue(event, 'p') || ''
          } catch (err) {
            console.log(err)
          }
        }
      })

      const removeDublicatePayments = () => {
        // O(n)
        const uniqueValues = new Set()
        return res
          .filter((obj) => {
            const value = obj.receiverPubkey

            if (!uniqueValues.has(value) && Boolean(value.length)) {
              uniqueValues.add(value)
              return true
            }

            return false
          })
          .map((el) => el.receiverPubkey)
      }

      const getMetas = await fetchMetas(removeDublicatePayments())

      const updatedPayments = () => {
        const metaEventHash: { [key: string]: MetaEvent } = {}

        getMetas.forEach((metaEvent) => {
          metaEventHash[metaEvent.pubkey] = metaEvent
        })

        return res.map((payment) => {
          const metaEvent = metaEventHash[payment.receiverPubkey]

          if (metaEvent) {
            return {
              ...payment,
              receiver: metaEvent
            }
          }

          return payment
        })
      }

      setPayments(updatedPayments())
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

  const paymentsByDate = filteredPayments.reduce((result: { [key: string]: TypePayment[] }, payment) => {
    const paymentDate = startOfDay(new Date(payment.timestamp))
    const formattedDate = format(paymentDate, 'd MMMM yyyy')

    if (!result[formattedDate]) {
      result[formattedDate] = []
    }

    result[formattedDate].push(payment)
    return result
  }, {})

  const convertToGroups = Object.entries(paymentsByDate).map(([date, payments]) => ({
    title: date,
    payments
  }))

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
      {convertToGroups.map((groupPayments) => (
        <>
          <h1>{groupPayments.title}</h1>
          {groupPayments.payments.map((payment) => (
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
        </>
      ))}
    </Container>
  )
}
