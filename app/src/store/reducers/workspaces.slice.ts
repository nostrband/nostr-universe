import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { WorkSpace } from '@/types/workspace'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { dbi } from '@/modules/db'

interface IWorkSpaceState {
  workspaces: WorkSpace[]
}

const initialState: IWorkSpaceState = {
  workspaces: []
}

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<{ workspaces: WorkSpace[] }>) => {
      state.workspaces = [...state.workspaces, ...action.payload.workspaces]
    },

    deletePermWorkspace: (state, action) => {
      const { pubkey } = action.payload.currentWorkSpace
      const id = action.payload.id

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            perms: workspace.perms.filter((p) => p.app !== id)
          }
        }

        return workspace
      })
    },

    setPermsWorkspace: (state, action) => {
      const { pubkey } = action.payload.currentWorkSpace
      const perm = action.payload.perm

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            perms: [...workspace.perms, perm]
          }
        }

        return workspace
      })
    },

    setScreenshotTab: (state, action) => {
      const { pubkey } = action.payload.currentWorkSpace
      const screenshot = action.payload.screenshot
      const id = action.payload.id

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            tabs: workspace.tabs.map((tab) => {
              if (tab.id === id) {
                return {
                  ...tab,
                  screenshot
                }
              }
              return tab
            }),
            lastCurrentTabId: ''
          }
        }

        return workspace
      })
    },

    removeTabFromTabs: (state, action) => {
      const id = action.payload.id
      const { pubkey } = action.payload.currentWorkSpace

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const currentTab = workspace.tabs.find((tab) => tab.id === id)

          return {
            ...workspace,
            tabs: workspace.tabs.filter((tab) => tab.id !== id),
            tabGroups: workspace.tabGroups.map((tab) => {
              if (tab.id === currentTab?.appNaddr) {
                return {
                  ...tab,
                  tabs: tab.tabs.filter((el) => el !== currentTab.id)
                }
              }

              return tab
            })
          }
        }

        return workspace
      })
    },

    clearTabGroup: (state, action) => {
      const { pubkey } = action.payload.currentWorkSpace
      const tabGrop = action.payload.tabGrop

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            tabs: workspace.tabs.filter((tab) => tab.appNaddr !== tabGrop.id),
            tabGroups: workspace.tabGroups.map((tab) => {
              if (tab.id === tabGrop.id) {
                return {
                  ...tab,
                  tabs: []
                }
              }

              return tab
            })
          }
        }

        return workspace
      })
    },

    setTabsWorkspace: (state, action) => {
      const { pubkey } = action.payload.currentWorkSpace
      const tab = action.payload.tab
      const id = getTabGroupId(tab)

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const tabGroups = workspace.tabGroups
          const tabIndex = workspace.tabGroups.findIndex((t) => t.id === id)

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

          return {
            ...workspace,
            tabs: [...workspace.tabs, tab],
            tabGroups: tabGroups,
            lastCurrentTabId: ''
          }
        }

        return workspace
      })
    },

    setUrlTabWorkspace: (state, action) => {
      const { pubkey } = action.payload.currentWorkSpace
      const url = action.payload.url
      const id = getTabGroupId(action.payload.tab)

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            tabs: workspace.tabs.map((tab) => {
              if (tab.id === id) {
                return {
                  ...tab,
                  url
                }
              }
              return tab
            }),
            lastCurrentTabId: ''
          }
        }

        return workspace
      })
    },

    swapTabGroups: (state, action) => {
      const { toID, fromID } = action.payload
      const { pubkey } = action.payload.currentWorkSpace

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const fromTabGroup = workspace.tabGroups.find((tg) => tg.id === fromID)
          const toTabGroup = workspace.tabGroups.find((tg) => tg.id === toID)

          const fromOrder = fromTabGroup ? fromTabGroup.order : 0
          const toOrder = toTabGroup ? toTabGroup.order : 0

          const swappedTabGroups = workspace.tabGroups.map((tabGroup) => {
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

          const swappedTabs = workspace.tabs.map((tab) => {
            const tabGroupId = getTabGroupId(tab)
            if (tabGroupId === fromID) {
              tab.order = toOrder
            }
            if (tabGroupId === toID) {
              tab.order = fromOrder
            }
            return tab
          })

          const swappedPins = workspace.pins.map((pin) => {
            const tabGroupId = getTabGroupId(pin)
            if (tabGroupId === fromID) {
              pin.order = toOrder
            }
            if (tabGroupId === toID) {
              pin.order = fromOrder
            }
            return pin
          })

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
  setTabsWorkspace,
  removeTabFromTabs,
  swapTabGroups,
  setPermsWorkspace,
  deletePermWorkspace,
  clearTabGroup,
  setScreenshotTab
} = workspacesSlice.actions

export const swapTabGroupsThunk = createAsyncThunk(
  'workspaces/swapTabGroupsThunk',
  async (
    {
      toID,
      fromID,
      currentWorkSpace: curWorkSpace
    }: { toID: string | number; fromID: string | number; currentWorkSpace: WorkSpace },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const { pubkey } = curWorkSpace
      const state = getState() as RootState

      const currentWorkSpace = state.workspaces.workspaces.find((workspace) => workspace.pubkey === pubkey)

      if (currentWorkSpace) {
        const fromTabGroup = currentWorkSpace.tabGroups.find((tg) => tg.id === fromID)
        const toTabGroup = currentWorkSpace.tabGroups.find((tg) => tg.id === toID)

        const fromOrder = fromTabGroup ? fromTabGroup.order : 0
        const toOrder = toTabGroup ? toTabGroup.order : 0

        const tabs = currentWorkSpace.tabs
        const fromTab = tabs.find((tab) => getTabGroupId(tab) === fromID)
        const toTab = tabs.find((tab) => getTabGroupId(tab) === toID)

        if (fromTab) {
          await dbi.updateTab({ ...fromTab, order: toOrder })
        }
        if (toTab) {
          await dbi.updateTab({ ...toTab, order: fromOrder })
        }

        const pins = currentWorkSpace.pins

        const fromPin = pins.find((pin) => getTabGroupId(pin) === fromID)
        const toPin = pins.find((pin) => getTabGroupId(pin) === toID)

        if (fromPin) {
          await dbi.updatePin({ ...fromPin, order: toOrder })
        }
        if (toPin) {
          await dbi.updatePin({ ...toPin, order: fromOrder })
        }

        dispatch(swapTabGroups({ toID, fromID, currentWorkSpace: curWorkSpace }))
      }
    } catch (error) {
      rejectWithValue('Something went wrong!')
    }
  }
)
