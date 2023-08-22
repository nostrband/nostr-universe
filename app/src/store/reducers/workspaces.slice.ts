import { WorkSpace } from '@/types/workspace'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IWorkSpaceState {
  workspaces: WorkSpace[]
  currentWorkSpace?: WorkSpace | null
}

const initialState: IWorkSpaceState = {
  workspaces: [],
  currentWorkSpace: null
}

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<IWorkSpaceState>) => {
      state.workspaces = [...state.workspaces, ...action.payload.workspaces]
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkSpace = state.workspaces.find((w) => w.pubkey === action.payload.currentPubKey)
    }
  }
})

export const { setWorkspaces, setCurrentWorkspace } = workspacesSlice.actions
