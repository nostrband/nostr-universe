import { createSlice } from '@reduxjs/toolkit'

interface ICurrentTab {
  id: string
  url: string
  picture: string
  name: string
  appNaddr: string
}

interface ITabState {
  isOpenTabWindow: boolean
  isLoading: boolean
  currentTab: ICurrentTab | null
  openedTabs: ICurrentTab[]
}

const initialState: ITabState = {
  isOpenTabWindow: false,
  isLoading: false,
  currentTab: null,
  openedTabs: []
}

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setOpenTab: (state, action) => {
      state.openedTabs = [...state.openedTabs, action.payload.tab]
      state.isLoading = true
      state.isOpenTabWindow = true
    },

    setCurrentTab: (state, action) => {
      state.currentTab = action.payload.currentTab
      state.isOpenTabWindow = true
    },

    setLoadingTab: (state, action) => {
      state.isLoading = action.payload.isLoading
    },

    setCloseTabWindow: (state, action) => {
      state.isOpenTabWindow = action.payload.isLoading
    }
  }
})

export const { setOpenTab, setCurrentTab, setLoadingTab, setCloseTabWindow } = tabSlice.actions
