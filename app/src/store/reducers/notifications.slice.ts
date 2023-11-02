import { AppNostr } from '@/types/app-nostr'
import { createSlice } from '@reduxjs/toolkit'

interface INotificationsState {
  appOfTheDay: AppNostr | null
  isShowAOTDWidget: boolean
}

const initialState: INotificationsState = {
  appOfTheDay: null,
  isShowAOTDWidget: false
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setAppOfTheDay: (state, action) => {
      state.appOfTheDay = action.payload.app
    },
    setIsShowAOTDWidget: (state, action) => {
      state.isShowAOTDWidget = action.payload.isShow
    }
  }
})

export const { setAppOfTheDay, setIsShowAOTDWidget } = notificationsSlice.actions
