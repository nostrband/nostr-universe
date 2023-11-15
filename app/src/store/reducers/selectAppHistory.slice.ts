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
        const index = resultArray.findIndex((oldItem) => oldItem.timestamp === newItem.timestamp)

        if (index === -1) {
          resultArray.push(newItem)
        } else {
          resultArray[index].numberOfLaunch = newItem.numberOfLaunch
          resultArray[index].nextSuggestTime = newItem.nextSuggestTime
        }
      })

      state.apps = resultArray
    }
  }
})

export const { setSelectAppHistory } = selectAppHistorySlice.actions
