import { WorkSpace } from '@/types/workspace'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { dbi } from '@/modules/db'
import { RootState } from '../store'
import { IPin } from '@/types/workspace'

interface IWorkSpaceState {
  workspaces: WorkSpace[]
}

const initialState: IWorkSpaceState = {
  workspaces: []
}

function updateWorkspace(state: IWorkSpaceState, pubkey: string, props: object | ((workspace: WorkSpace) => object)) {
  state.workspaces = state.workspaces.map((workspace: WorkSpace) => {
    if (workspace.pubkey === pubkey) {
      if (props instanceof Function) props = props(workspace)
      return {
        ...workspace,
        ...props
      }
    }

    return workspace
  })
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
      updateWorkspace(state, workspacePubkey, { pubkey })
    },

    deletePermWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const id = action.payload.id
      console.log('deletePermWorkspace', pubkey, id)

      updateWorkspace(state, pubkey, (ws: WorkSpace) => ({ perms: ws.perms.filter((p) => p.app !== id) }))
    },

    setPermsWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const perm = action.payload.perm
      console.log('setPermsWorkspace', pubkey, JSON.stringify(perm))

      updateWorkspace(state, pubkey, (ws: WorkSpace) => ({ perms: [...ws.perms, perm] }))
    },

    removeTabWorkspace: (state, action) => {
      const id = action.payload.id
      const pubkey = action.payload.workspacePubkey

      updateWorkspace(state, pubkey, (ws: WorkSpace) => ({ tabIds: ws.tabIds.filter((tid) => tid !== id) }))
    },

    removePinWorkspace: (state, action) => {
      const id = action.payload.id
      const pubkey = action.payload.workspacePubkey

      updateWorkspace(state, pubkey, (ws: WorkSpace) => ({ pins: ws.pins.filter((pin) => pin.id !== id) }))
    },

    updatePinWorkspace: (state, action) => {
      const edittedPin = action.payload.pin
      const pubkey = action.payload.workspacePubkey

      updateWorkspace(state, pubkey, (ws: WorkSpace) => ({
        pins: ws.pins.map((pin) => (pin.id === edittedPin.id ? { ...pin, title: edittedPin.title } : pin))
      }))
    },

    addTabWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const id = action.payload.id

      updateWorkspace(state, pubkey, (ws: WorkSpace) => ({ tabIds: [...ws.tabIds, id] }))
    },

    addPinWorkspace: (state, action) => {
      const pubkey = action.payload.workspacePubkey
      const pin = action.payload.pin

      updateWorkspace(state, pubkey, (ws: WorkSpace) => ({ pins: [...ws.pins, pin] }))
    },

    swapPins: (state, action) => {
      const { toID, fromID } = action.payload
      const pubkey = action.payload.workspacePubkey

      updateWorkspace(state, pubkey, (ws: WorkSpace) => {
        const fromPin = ws.pins.find((p) => p.id == fromID)
        const toPin = ws.pins.find((p) => p.id == toID)

        const fromOrder = fromPin ? fromPin.order : 0
        const toOrder = toPin ? toPin.order : 0
        console.log('swap order', fromOrder, toOrder)

        dbi.updatePinOrder(fromID, toOrder)
        dbi.updatePinOrder(toID, fromOrder)

        const swappedPins = ws.pins.map((pin) => {
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
          pins: swappedPins
        }
      })
    },
    setLastKindApp: (state, action) => {
      const { app, workspacePubkey } = action.payload
      updateWorkspace(state, workspacePubkey, (ws: WorkSpace) => {
        ws.lastKindApps[app.kind] = app
        return {
          lastKindApps: { ...ws.lastKindApps }
        }
      })
    },
    updateWorkspaceContentFeedSettings: (state, action) => {
      const { workspacePubkey, newSettings } = action.payload
      updateWorkspace(state, workspacePubkey, {
        contentFeedSettings: newSettings
      })
    },
    switchFeedVisibilityWorkspace: (state, action) => {
      const { workspacePubkey, newContentFeedSettings } = action.payload
      updateWorkspace(state, workspacePubkey, {
        contentFeedSettings: newContentFeedSettings
      })
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
  setLastKindApp,
  updatePinWorkspace,
  updateWorkspaceContentFeedSettings,
  switchFeedVisibilityWorkspace
} = workspacesSlice.actions

export const selectPin = (state: RootState, id: string): IPin | undefined => {
  const currentWorkspace = state.workspaces.workspaces.find(
    (workspace) => workspace.pubkey === state.keys.currentPubkey
  )
  if (!currentWorkspace) return undefined

  const currentPin = currentWorkspace.pins.find((pin) => pin.id === id)
  return currentPin
}

export const selectWorkspaceContentFeeds = (state: RootState) => {
  const currentWorkspace = state.workspaces.workspaces.find(
    (workspace) => workspace.pubkey === state.keys.currentPubkey
  )
  if (!currentWorkspace) return []
  return currentWorkspace.contentFeedSettings
}
