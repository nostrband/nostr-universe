import { AppNostr } from '@/types/app-nostr'
import { createSlice } from '@reduxjs/toolkit'

interface IAppsState {
  apps: AppNostr[] | null
}

const initialState: IAppsState = {
  apps: null
}

export const appsSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    setApps: (state, action) => {
      state.apps = action.payload.apps
    }
  }
})

export const { setApps } = appsSlice.actions
