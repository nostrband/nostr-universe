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
    addWorkspaces: (state, action: PayloadAction<{ workspaces: WorkSpace[] }>) => {
      state.workspaces = [...state.workspaces, ...action.payload.workspaces]
    },

    updateWorkspacePubkey: (state, action) => {
      const workspacePubkey = action.payload.workspacePubkey
      const pubkey = action.payload.pubkey
      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === workspacePubkey) {
          return {
            ...workspace,
            pubkey
          }
        }

        return workspace
      })
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

    removeTabWorkspace: (state, action) => {
      const id = action.payload.id
      const pubkey = action.payload.workspacePubkey

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            tabIds: workspace.tabIds.filter((tid) => tid !== id)
          }
        }

        return workspace
      })
    },

    removePinWorkspace: (state, action) => {
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

    addTabWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const id = action.payload.id

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          return {
            ...workspace,
            tabIds: [...workspace.tabIds, id]
          }
        }

        return workspace
      })
    },

    addPinWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const pin = action.payload.pin

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const pins = [...workspace.pins, pin]
          return {
            ...workspace,
            pins: pins
          }
        }

        return workspace
      })
    },

    swapPins: (state, action) => {
      const { toID, fromID } = action.payload
      const pubkey = action.payload.workspacePubkey

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.pubkey === pubkey) {
          const fromPin = workspace.pins.find((p) => p.id == fromID)
          const toPin = workspace.pins.find((p) => p.id == toID)

          const fromOrder = fromPin ? fromPin.order : 0
          const toOrder = toPin ? toPin.order : 0
          console.log('swap order', fromOrder, toOrder)

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
            pins: swappedPins
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
  addWorkspaces,
  updateWorkspacePubkey,
  addTabWorkspace,
  removePinWorkspace,
  addPinWorkspace,
  removeTabWorkspace,
  swapPins,
  setPermsWorkspace,
  deletePermWorkspace,
  setLastKindApp
} = workspacesSlice.actions
