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

    removeTabFromTabs: (state, action) => {
      state.currentWorkSpace = {
        ...state.currentWorkSpace,
        tabs: state.currentWorkSpace.tabs.filter((tab) => tab.id !== action.payload.id),
        tabGroups: state.currentWorkSpace.tabGroups.map((tab) => {
          if (tab.id === action.payload.currentTab.appNaddr) {
            return {
              ...tab,
              tabs: tab.tabs.filter((el) => el !== action.payload.currentTab.id)
            }
          }

          return tab
        })
      }
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

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === state.currentWorkSpace.pubkey) {
          return {
            ...workspace,
            tabs: [...state.currentWorkSpace.tabs, action.payload.tab],
            tabGroups: tabGroups
          }
        }

        return workspace
      })
    }
  }
})

export const { setWorkspaces, setCurrentWorkspace, setTabsWorkspace, removeTabFromTabs } = workspacesSlice.actions
