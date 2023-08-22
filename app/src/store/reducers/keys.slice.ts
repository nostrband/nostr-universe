import { createSlice } from '@reduxjs/toolkit'

interface IKeysState {
  keys: string[]
  currentPubKey: string
}

const initialState: IKeysState = {
  keys: [],
  currentPubKey: ''
}

export const keysSlice = createSlice({
  name: 'keys',
  initialState,
  reducers: {
    setKeys: (state, action) => {
      state.keys = action.payload.keys
    },

    setCurrentPubKey: (state, action) => {
      state.currentPubKey = action.payload.currentPubKey
    }
  }
})

export const { setKeys, setCurrentPubKey } = keysSlice.actions
