import { createSlice } from '@reduxjs/toolkit'

export type TypeListSelectApp = {
  name: string
  timestamp: number
  pubkey: string
  naddr: string
  kind: number
  nextSuggestTime: number
  numberOfLaunch: number
}

export interface ISelectAppHistory {
  apps: TypeListSelectApp[]
}

const initialState: ISelectAppHistory = {
  apps: []
}

export const selectAppHistorySlice = createSlice({
  name: 'selectAppHistory',
  initialState,
  reducers: {
    setSelectAppHistory: (state, action) => {
      const resultArray = [...state.apps]

      action.payload.apps.forEach((newItem: TypeListSelectApp) => {
        // timestamp is id of the selectAppHistory item
        const item = resultArray.find((oldItem) => oldItem.timestamp === newItem.timestamp)
        if (!item) {
          resultArray.push(newItem)
        } else {
          item.numberOfLaunch = newItem.numberOfLaunch
          item.nextSuggestTime = newItem.nextSuggestTime
        }
      })

      state.apps = resultArray
    }
  }
})

export const { setSelectAppHistory } = selectAppHistorySlice.actions
