import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { WorkSpace } from '@/types/workspace'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IWorkSpaceState {
  workspaces: WorkSpace[]
  currentWorkSpace: WorkSpace
}

const initialState: IWorkSpaceState = {
  workspaces: [],
  currentWorkSpace: {
    pubkey: '',
    trendingProfiles: [],
    trendingNotes: [],
    longNotes: [],
    liveEvents: [],
    suggestedProfiles: [],
    tabGroups: [],
    tabs: [],
    pins: [],
    lastKindApps: {},
    currentTabId: '',
    lastCurrentTabId: ''
  }
}

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<{ workspaces: WorkSpace[] }>) => {
      state.workspaces = [...state.workspaces, ...action.payload.workspaces]
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkSpace =
        state.workspaces.find((w) => w.pubkey === action.payload.currentPubKey) || initialState.currentWorkSpace
    },
    setOpenCurrentTabInWorkSpace: (state, action) => {
      const tabs = state.currentWorkSpace.tabs.map((tab) => {
        if (tab.id === action.payload.tabID) {
          return {
            ...tab,
            isOpened: action.payload.isOpened
          }
        }

        return tab
      })
      state.currentWorkSpace = { ...state.currentWorkSpace, tabs }
    },
    setTabsWorkspace: (state, action) => {
      const tabGroups = [...state.currentWorkSpace.tabGroups]
      const tab = action.payload.tab

      const id = getTabGroupId(tab)
      const tabIndex = state.currentWorkSpace.tabGroups.findIndex((t) => t.id === id)

      if (tabIndex !== -1) {
        tabGroups[tabIndex].tabs.push(tab.id)
      } else {
        tabGroups.push({
          id,
          info: tab,
          tabs: [tab.id],
          pin: tab,
          lastTabId: '',
          lastActive: 0
        })
      }

      state.currentWorkSpace = {
        ...state.currentWorkSpace,
        tabs: [...state.currentWorkSpace.tabs, action.payload.tab],
        tabGroups: tabGroups,
        lastCurrentTabId: ''
      }
    }
  }
})

export const { setWorkspaces, setCurrentWorkspace, setTabsWorkspace, setOpenCurrentTabInWorkSpace } =
  workspacesSlice.actions
