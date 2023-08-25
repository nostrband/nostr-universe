import { createSlice } from '@reduxjs/toolkit'

interface ITabState {
  isOpen: boolean
  isLoading: boolean
  currentTab: {
    id: string
    url: string
    picture: string
    name: string
    appNaddr: string
    isOpened: boolean
  } | null
}

const initialState: ITabState = {
  isOpen: false,
  isLoading: false,
  currentTab: null
}

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setOpenTab: (state, action) => {
      state.isOpen = action.payload.isOpen
    },

    setCurrentTab: (state, action) => {
      state.currentTab = action.payload.currentTab
    },

    setLoadingTab: (state, action) => {
      state.isLoading = action.payload.isLoading
    }
  }
})

export const { setOpenTab, setCurrentTab, setLoadingTab } = tabSlice.actions
