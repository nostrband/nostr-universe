import { createSlice } from '@reduxjs/toolkit'

interface IPermissionsState {
  permissions: string[]
}

const initialState: IPermissionsState = {
  permissions: []
}

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermission: (state, action) => {
      state.permissions = [...state.permissions, action.payload.permission]
    }
  }
})

export const { setPermission } = permissionsSlice.actions
