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
  currentTabId: string | null
}

const initialState: ITabState = {
  isLoading: false,
  openedTabs: [],
  currentTabId: null
}

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setOpenTab: (state, action) => {
      state.openedTabs = [...state.openedTabs, action.payload.tab]
    },

    setIcontab: (state, action) => {
      state.openedTabs = state.openedTabs.map((tab) => {
        if (action.payload.id === tab.id) {
          return {
            ...tab,
            icon: action.payload.icon
          }
        }

        return tab
      })
    },

    setLoadingTab: (state, action) => {
      state.isLoading = action.payload.isLoading
    },

    setCurrentTabId: (state, action) => {
      state.currentTabId = action.payload.id
    }
  }
})

export const { setOpenTab, setLoadingTab, setIcontab, setCurrentTabId } = tabSlice.actions
