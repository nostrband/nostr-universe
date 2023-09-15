import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { WorkSpace } from '@/types/workspace'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { dbi } from '@/modules/db'

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
    perms: [],
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
      const id = action.payload.id
      const currentTab = state.currentWorkSpace.tabs.find((tab) => tab.id === id)

      state.currentWorkSpace = {
        ...state.currentWorkSpace,
        tabs: state.currentWorkSpace.tabs.filter((tab) => tab.id !== id),
        tabGroups: state.currentWorkSpace.tabGroups.map((tab) => {
          if (tab.id === currentTab?.appNaddr) {
            return {
              ...tab,
              tabs: tab.tabs.filter((el) => el !== currentTab.id)
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
          lastActive: 0,
          order: tab.order
        })
      }

      state.currentWorkSpace = {
        ...state.currentWorkSpace,
        tabs: [...state.currentWorkSpace.tabs, tab],
        tabGroups: tabGroups,
        lastCurrentTabId: ''
      }

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === state.currentWorkSpace.pubkey) {
          return {
            ...workspace,
            tabs: [...state.currentWorkSpace.tabs, tab],
            tabGroups: tabGroups
          }
        }

        return workspace
      })
    },

    setUrlTabWorkspace: (state, action) => {
      const url = action.payload.url
      const id = getTabGroupId(action.payload.tab)

      const tabs = state.currentWorkSpace.tabs.map((tab) => {
        if (tab.id === id) {
          return {
            ...tab,
            url
          }
        }
        return tab
      })

      state.currentWorkSpace = {
        ...state.currentWorkSpace,
        tabs,
        lastCurrentTabId: ''
      }

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === state.currentWorkSpace.pubkey) {
          return {
            ...workspace,
            tabs
          }
        }

        return workspace
      })
    },
    swapTabGroups: (state, action) => {
      const { toID, fromID } = action.payload
      const { currentWorkSpace } = state

      const fromTabGroup = currentWorkSpace.tabGroups.find((tg) => tg.id === fromID)
      const toTabGroup = currentWorkSpace.tabGroups.find((tg) => tg.id === toID)

      const fromOrder = fromTabGroup ? fromTabGroup.order : 0
      const toOrder = toTabGroup ? toTabGroup.order : 0

      const swappedTabGroups = state.currentWorkSpace.tabGroups.map((tabGroup) => {
        if (tabGroup.id === fromID) {
          tabGroup.order = toOrder
          tabGroup.info.order = toOrder
          tabGroup.pin.order = toOrder
        }
        if (tabGroup.id === toID) {
          tabGroup.order = fromOrder
          tabGroup.info.order = fromOrder
          tabGroup.pin.order = fromOrder
        }
        return tabGroup
      })

      const swappedTabs = state.currentWorkSpace.tabs.map((tab) => {
        const tabGroupId = getTabGroupId(tab)
        if (tabGroupId === fromID) {
          tab.order = toOrder
        }
        if (tabGroupId === toID) {
          tab.order = fromOrder
        }
        return tab
      })

      const swappedPins = state.currentWorkSpace.pins.map((pin) => {
        const tabGroupId = getTabGroupId(pin)
        if (tabGroupId === fromID) {
          pin.order = toOrder
        }
        if (tabGroupId === toID) {
          pin.order = fromOrder
        }
        return pin
      })

      state.currentWorkSpace.tabs = swappedTabs
      state.currentWorkSpace.pins = swappedPins
      state.currentWorkSpace.tabGroups = swappedTabGroups

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === state.currentWorkSpace.pubkey) {
          return {
            ...workspace,
            tabs: swappedTabs,
            pins: swappedPins,
            tabGroups: swappedTabGroups
          }
        }

        return workspace
      })
    }
  }
})

export const {
  setWorkspaces,
  setUrlTabWorkspace,
  setCurrentWorkspace,
  setTabsWorkspace,
  removeTabFromTabs,
  swapTabGroups
} = workspacesSlice.actions

export const swapTabGroupsThunk = createAsyncThunk(
  'workspaces/swapTabGroupsThunk',
  async (
    { toID, fromID }: { toID: string | number; fromID: string | number },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const state = getState() as RootState

      const fromTabGroup = state.workspaces.currentWorkSpace.tabGroups.find((tg) => tg.id === fromID)
      const toTabGroup = state.workspaces.currentWorkSpace.tabGroups.find((tg) => tg.id === toID)

      const fromOrder = fromTabGroup ? fromTabGroup.order : 0
      const toOrder = toTabGroup ? toTabGroup.order : 0

      const tabs = state.workspaces.currentWorkSpace.tabs
      const fromTab = tabs.find((tab) => getTabGroupId(tab) === fromID)
      const toTab = tabs.find((tab) => getTabGroupId(tab) === toID)

      if (fromTab) {
        await dbi.updateTab({ ...fromTab, order: toOrder })
      }
      if (toTab) {
        await dbi.updateTab({ ...toTab, order: fromOrder })
      }

      const pins = state.workspaces.currentWorkSpace.pins

      const fromPin = pins.find((pin) => getTabGroupId(pin) === fromID)
      const toPin = pins.find((pin) => getTabGroupId(pin) === toID)

      if (fromPin) {
        await dbi.updatePin({ ...fromPin, order: toOrder })
      }
      if (toPin) {
        await dbi.updatePin({ ...toPin, order: fromOrder })
      }

      dispatch(swapTabGroups({ toID, fromID }))
    } catch (error) {
      rejectWithValue('Something went wrong!')
    }
  }
)
