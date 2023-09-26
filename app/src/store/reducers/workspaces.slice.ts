import { addToTabGroup, getTabGroupId } from '@/modules/AppInitialisation/utils'
import { WorkSpace } from '@/types/workspace'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
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
      console.log('deletePermWorkspace', pubkey, id)

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
      console.log('setPermsWorkspace', pubkey, JSON.stringify(perm))

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
            })
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
          const pins = workspace.pins

          return {
            ...workspace,
            tabs: workspace.tabs.filter((tab) => tab.id !== id),
            tabGroups: workspace.tabGroups
              .map((tg) => {
                if (tg.id === getTabGroupId(currentTab)) {
                  return {
                    ...tg,
                    tabs: tg.tabs.filter((el) => el !== id)
                  }
                }

                return tg
              })
              .filter((tg) => pins.find((pin) => pin.appNaddr === tg.id) || tg.tabs.length > 0)
          }
        }

        return workspace
      })
    },

    removePinFromPins: (state, action) => {
      const { id } = action.payload.pin
      const pubkey = action.payload.workspacePubkey

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            pins: workspace.pins.filter((pin) => pin.id !== id)
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
            tabGroups: workspace.tabGroups
              .map((tg) => {
                if (tg.id === tabGroup.id) {
                  return {
                    ...tg,
                    tabs: []
                  }
                }

                return tg
              })
              .filter((tg) => tg.pin || tg.tabs.length > 0)
          }
        }

        return workspace
      })
    },

    setTabsWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const tab = action.payload.tab

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const pins = workspace.pins
          const tabs = [...workspace.tabs, tab]
          const tabGroups = addToTabGroup(pins, tabs)

          return {
            ...workspace,
            tabs: tabs,
            tabGroups: tabGroups
          }
        }

        return workspace
      })
    },

    setPinsWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const pin = action.payload.pin

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const pins = [...workspace.pins, pin]
          const tabs = workspace.tabs
          const tabGroups = addToTabGroup(pins, tabs)

          return {
            ...workspace,
            pins: pins,
            tabGroups: tabGroups
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
            })
          }
        }

        return workspace
      })

      // FIXME implement switch between tab groups
    },

    swapPins: (state, action) => {
      const { toID, fromID } = action.payload
      const pubkey = action.payload.workspacePubkey

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const fromPin = workspace.pins.find(p => p.id == fromID)
          const toPin = workspace.pins.find(p => p.id == toID)

          const fromOrder = fromPin ? fromPin.order : 0
          const toOrder = toPin ? toPin.order : 0
          console.log("swap order", fromOrder, toOrder)

          dbi.updatePinOrder(fromID, toOrder)
          dbi.updatePinOrder(toID, fromOrder)

          const swappedPins = workspace.pins.map((pin) => {
            if (pin.id === fromID) {
              return { ...pin, order: toOrder }
            }
            if (pin.id === toID) {
              return { ...pin, order: fromOrder }
            }
            return pin
          })
          swappedPins.sort((a, b) => a.order - b.order)

          return {
            ...workspace,
            pins: swappedPins,
          }
        }

        return workspace
      })
    },
    setLastKindApp: (state, action) => {
      const { kind, naddr, workspacePubkey } = action.payload

      const ws = state.workspaces.find((ws) => ws.pubkey === workspacePubkey)
      if (ws) ws.lastKindApps[kind] = naddr
    }
  }
})

export const {
  setWorkspaces,
  setUrlTabWorkspace,
  setTabsWorkspace,
  removePinFromPins,
  setPinsWorkspace,
  removeTabFromTabs,
  swapPins,
  setPermsWorkspace,
  deletePermWorkspace,
  clearTabGroup,
  setScreenshotTab,
  setLastKindApp
} = workspacesSlice.actions
