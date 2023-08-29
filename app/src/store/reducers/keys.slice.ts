import { createSlice } from '@reduxjs/toolkit'

interface IKeysState {
  keys: string[]
  currentPubKey: string
  readKeys: string[]
}

const initialState: IKeysState = {
  keys: [],
  currentPubKey: '',
  readKeys: []
}

export const keysSlice = createSlice({
  name: 'keys',
  initialState,
  reducers: {
    setKeys: (state, action) => {
      state.keys = action.payload.keys
    },

    setReadKeys: (state, action) => {
      state.readKeys = action.payload.readKeys
    },

    setCurrentPubKey: (state, action) => {
      state.currentPubKey = action.payload.currentPubKey
    }
  }
})

export const { setKeys, setCurrentPubKey, setReadKeys } = keysSlice.actions
