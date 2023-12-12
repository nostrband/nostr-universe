import { ISyncState } from '@/types/sync-state'
import { createSlice } from '@reduxjs/toolkit'

interface ISyncStateInfo {
  syncState: ISyncState
}

const initialState: ISyncStateInfo = {
  syncState: {
    done: 0,
    todo: 0,
    newEventCount: 0,
  }
}

export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setSyncState: (state, action) => {
      state.syncState = {
        ...action.payload
      }
    }
  }
})

export const { setSyncState } = syncSlice.actions
