import { dbi } from '@/modules/db'
import { fetchFullyAugmentedEventsByAddrs, getEventNip19, parseAddr } from '@/modules/nostr'
import { SearchClickEvent } from '@/modules/types/db'
import { AugmentedEvent } from '@/types/augmented-event'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { EventAddr } from '@/types/event-addr'

export type RecentEvent = SearchClickEvent & { event: AugmentedEvent }

interface ISearchModalState {
  searchValue: ''
  recentEvents: RecentEvent[]
  isRecentEventsLoading: boolean
}

const initialState: ISearchModalState = {
  searchValue: '',
  recentEvents: [],
  isRecentEventsLoading: false
}

export const searchModalSlice = createSlice({
  name: 'searchModal',
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload.searchValue
    },
    setRecentEvents: (state, action) => {
      state.recentEvents = action.payload.recentEvents
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchRecentEventsThunk.pending, (state) => {
        state.isRecentEventsLoading = true
      })
      .addCase(fetchRecentEventsThunk.fulfilled, (state) => {
        state.isRecentEventsLoading = false
      })
})

export const { setSearchValue, setRecentEvents } = searchModalSlice.actions

export const fetchRecentEventsThunk = createAsyncThunk<void, { currentPubkey: string; contactList: string[] }>(
  'searchModal/fetchRecentEventsThunk',
  async ({ contactList, currentPubkey }, { dispatch, fulfillWithValue }) => {
    try {
      console.log('fetching recently found events')

      // const searchClickHistory = await dbi.listSearchClickHistory(currentPubkey)

      // const recentEvents = []

      // for (const searchItem of searchClickHistory) {
      //   const addr = parseAddr(searchItem.addr)
      //   if (!addr) continue

      //   const [event] = await fetchFullyAugmentedEventsByAddrs([addr], contactList)
      //   if (!event) continue

      //   recentEvents.push({ event, ...searchItem })
      // }

      // dispatch(setRecentEvents({ recentEvents }))

      const searchClickHistory = await dbi.listSearchClickHistory(currentPubkey)

      let addrs: EventAddr[] = []
      for (const searchItem of searchClickHistory) {
        const addr = parseAddr(searchItem.addr)
        if (addr) {
          addrs.push(addr)
        }
      }

      const events = await fetchFullyAugmentedEventsByAddrs(addrs, contactList)
      console.log("fetchFullyAugmentedEventsByAddrs", events)
      const recentEvents: RecentEvent[] = []

      for (const event of events) {
        const addr = getEventNip19(event)
        const searchItem = searchClickHistory.find(e => e.addr === addr)
        if (searchItem)
          recentEvents.push({ event, ...searchItem })
      }
      // for (let i = 0; i < searchClickHistory.length; i++) {
      //   const searchItem = searchClickHistory[i]
      //   const [event] = events[i]

      //   if (event) {
      //     recentEvents.push({ event, ...searchItem })
      //   }
      // }

      dispatch(setRecentEvents({ recentEvents }))
      fulfillWithValue(recentEvents)
    } catch (error) {
      console.log(error)
    }
  }
)

export const deleteRecentEventByIdThunk = createAsyncThunk<void, string>(
  'searchModal/deleteRecentEventByIdThunk',
  async (id, { dispatch, getState }) => {
    try {
      const state = getState() as RootState

      const contactList = state.contentWorkSpace.contactList?.contactPubkeys || []
      const currentPubkey = state.keys.currentPubkey
      const recentEvents = state.searchModal.recentEvents || []

      const filteredRecentEvents = recentEvents.filter((e) => e.id !== id)
      dispatch(setRecentEvents({ recentEvents: filteredRecentEvents }))
      dbi.deleteSearchClickEvent(id).then(() => {
        dispatch(fetchRecentEventsThunk({ currentPubkey, contactList }))
      })
    } catch (error) {
      console.log(error)
    }
  }
)
