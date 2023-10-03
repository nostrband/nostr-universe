import { createSlice } from '@reduxjs/toolkit'

interface IKeysState {
  keys: string[]
  currentPubkey: string
  readKeys: string[]
  nsbKeys: string[]
}

const initialState: IKeysState = {
  keys: [],
  currentPubkey: '',
  readKeys: [],
  nsbKeys: []
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

    setNsbKeys: (state, action) => {
      state.nsbKeys = action.payload.nsbKeys
    },

    setCurrentPubkey: (state, action) => {
      state.currentPubkey = action.payload.currentPubkey
    }
  }
})

export const {
  setKeys,
  setCurrentPubkey,
  setReadKeys,
  setNsbKeys
} = keysSlice.actions
