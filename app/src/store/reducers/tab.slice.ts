import { createSlice } from '@reduxjs/toolkit'

interface ICurrentTab {
  id: string
  url: string
  picture: string
  name: string
  appNaddr: string
  loading: boolean
}

interface ITabState {
  openedTabs: ICurrentTab[]
}

const initialState: ITabState = {
  openedTabs: []
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
      state.openedTabs = state.openedTabs.map((tab) => {
        if (action.payload.id === tab.id) {
          return {
            ...tab,
            loading: action.payload.isLoading
          }
        }

        return tab
      })
    }
  }
})

export const { setOpenTab, setLoadingTab, setIcontab } = tabSlice.actions
