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
      const pubkey = action.payload.workspacePubkey
      const id = action.payload.id
      console.log("deletePermWorkspace", pubkey, id)

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
      const pubkey = action.payload.workspacePubkey
      const perm = action.payload.perm
      console.log("setPermsWorkspace", pubkey, JSON.stringify(perm))

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
      const pubkey = action.payload.workspacePubkey
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
          }
        }

        return workspace
      })
    },

    removeTabFromTabs: (state, action) => {
      const id = action.payload.id
      const pubkey = action.payload.workspacePubkey

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const currentTab = workspace.tabs.find((tab) => tab.id === id)

          return {
            ...workspace,
            tabs: workspace.tabs.filter((tab) => tab.id !== id),
            tabGroups: workspace.tabGroups.map((tg) => {
              if (tg.id === getTabGroupId(currentTab)) {
                return {
                  ...tg,
                  tabs: tg.tabs.filter((el) => el !== id)
                }
              }

              return tg
            }).filter((tg) => tg.pin || tg.tabs.length > 0)
          }
        }

        return workspace
      })
    },

    clearTabGroup: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const tabGroup = action.payload.tabGroup

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            tabs: workspace.tabs.filter((tab) => getTabGroupId(tab) !== tabGroup.id),
            tabGroups: workspace.tabGroups.map((tg) => {
              if (tg.id === tabGroup.id) {
                return {
                  ...tg,
                  tabs: []
                }
              }

              return tg
            }).filter((tg) => tg.pin || tg.tabs.length > 0)
          }
        }

        return workspace
      })
    },

    setTabsWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
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
          }
        }

        return workspace
      })
    },

    setUrlTabWorkspace: (state, action) => {
      const { workspacePubkey: pubkey, tabId: id, url } = action.payload

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
          }
        }

        return workspace
      })

      // FIXME implement switch between tab groups
    },

    swapTabGroups: (state, action) => {
      const { toID, fromID } = action.payload
      const pubkey = action.payload.workspacePubkey

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
    },
    setLastKindApp: (state, action) => {
      const { kind, naddr, workspacePubkey } = action.payload

      const ws = state.workspaces.find((ws) => ws.pubkey === workspacePubkey);
      if (ws) ws.lastKindApps[kind] = naddr
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
  setScreenshotTab,
  setLastKindApp
} = workspacesSlice.actions

export const swapTabGroupsThunk = createAsyncThunk(
  'workspaces/swapTabGroupsThunk',
  async (
    {
      toID,
      fromID,
      workspacePubkey
    }: { toID: string | number; fromID: string | number; workspacePubkey: string | undefined },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const pubkey = workspacePubkey
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

        dispatch(swapTabGroups({ toID, fromID, workspacePubkey }))
      }
    } catch (error) {
      rejectWithValue('Something went wrong!')
    }
  }
)
