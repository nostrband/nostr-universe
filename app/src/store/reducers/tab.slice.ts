import { ITab } from '@/types/tab'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface ITabState {
  tabs: ITab[]
  currentTabId: string | null
}

const initialState: ITabState = {
  tabs: [],
  currentTabId: null
}

function updateTab(state: ITabState, id: string, props: object) {
  state.tabs = state.tabs.map((tab) => {
    if (id === tab.id) {
      const t = {
        ...tab,
        ...props
      }
      return t
    }

    return tab
  })
}

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    addTabs: (state, action: PayloadAction<{ tabs: ITab[] }>) => {
      state.tabs = [...state.tabs, ...action.payload.tabs]
    },
    removeTab: (state, action) => {
      const id = action.payload.id
      state.tabs = state.tabs.filter((t) => t.id != id)
    },

    setTabCreated: (state, action) => {
      updateTab(state, action.payload.id, { created: true })
    },

    setTabUrl: (state, action) => {
      updateTab(state, action.payload.id, { url: action.payload.url })
    },

    setTabTitle: (state, action) => {
      updateTab(state, action.payload.id, { title: action.payload.title })
    },

    setTabIcon: (state, action) => {
      updateTab(state, action.payload.id, { icon: action.payload.icon })
    },

    setTabScreenshot: (state, action) => {
      updateTab(state, action.payload.id, { screenshot: action.payload.screenshot })
    },

    setTabIsLoading: (state, action) => {
      updateTab(state, action.payload.id, { loading: action.payload.isLoading })
    },

    setCurrentTabId: (state, action) => {
      state.currentTabId = action.payload.id
      if (action.payload.id)
        updateTab(state, action.payload.id, { lastActive: Date.now() })
    }
  }
})

export const {
  addTabs,
  removeTab,
  setTabCreated,
  setTabIsLoading,
  setTabUrl,
  setTabTitle,
  setTabIcon,
  setTabScreenshot,
  setCurrentTabId
} = tabSlice.actions

export const selectTab = (state: RootState, id: string): ITab | undefined => {
  return state.tab.tabs.find((tab: ITab) => tab.id === id)
}
