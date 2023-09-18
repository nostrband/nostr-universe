import { IPermReq } from '@/types/permission-req'
import { createSlice } from '@reduxjs/toolkit'

interface IPermissionsState {
  permissionRequests: IPermReq[]
}

const initialState: IPermissionsState = {
  permissionRequests: []
}

export const permissionRequestsSlice = createSlice({
  name: 'permissionRequests',
  initialState,
  reducers: {
    setPermissionRequest: (state, action) => {
      state.permissionRequests = [...state.permissionRequests, action.payload.permissionRequest]
    },

    deletePermissionRequest: (state, action) => {
      state.permissionRequests = state.permissionRequests.filter((perm) => perm.id === action.payload.id)
    }
  }
})

export const { setPermissionRequest, deletePermissionRequest } = permissionRequestsSlice.actions
