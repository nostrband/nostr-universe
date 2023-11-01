import { MetaEvent } from '@/types/meta-event'
import { createSlice } from '@reduxjs/toolkit'

export type CurrentEvent = {
  author: MetaEvent
  pubkey: string
  time?: number
  content?: string
}

interface ISelectedEventSlice {
  currentEvent: CurrentEvent | null
}

const initialState: ISelectedEventSlice = {
  currentEvent: null
}

export const selectedEventSlice = createSlice({
  name: 'selectedEvent',
  initialState,
  reducers: {
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload.currentEvent
    }
  }
})

export const { setCurrentEvent } = selectedEventSlice.actions
