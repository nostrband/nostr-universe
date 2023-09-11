import { createSlice } from '@reduxjs/toolkit'

interface ICurrentTab {
  id: string
  url: string
  picture: string
  name: string
  appNaddr: string
}

interface ITabState {
  isLoading: boolean
  openedTabs: ICurrentTab[]
}

const initialState: ITabState = {
  isLoading: false,
  openedTabs: []
}

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setOpenTab: (state, action) => {
      state.openedTabs = [...state.openedTabs, action.payload.tab]
    },

    setLoadingTab: (state, action) => {
      state.isLoading = action.payload.isLoading
    }

    // setCurrentTab: (state, action) => {
    //   state.currentTab = action.payload.currentTab
    //   // state.isOpenTabWindow = true
    // },
    // setCloseTabWindow: (state, action) => {
    //   state.isOpenTabWindow = action.payload.isLoading
    // }
  }
})

export const { setOpenTab, setLoadingTab } = tabSlice.actions
