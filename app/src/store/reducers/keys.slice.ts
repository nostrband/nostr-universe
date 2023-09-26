import { createSlice } from '@reduxjs/toolkit'

interface IKeysState {
  keys: string[]
  currentPubkey: string
  readKeys: string[]
}

const initialState: IKeysState = {
  keys: [],
  currentPubkey: '',
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

    setCurrentPubkey: (state, action) => {
      state.currentPubkey = action.payload.currentPubkey
    }
  }
})

export const { setKeys, setCurrentPubkey, setReadKeys } = keysSlice.actions
